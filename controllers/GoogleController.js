import fs from 'fs';
import http from 'http';
import url from 'url';
import open from 'open';
import destroyer from 'server-destroy';

import { google } from 'googleapis';

import GoogleTask from '../models/GoogleTask.js';

const filePath = process.env.GOOGLE_CREDENTIALS_FILE;
const rawKeys = fs.readFileSync(filePath);
const keys = JSON.parse(rawKeys);

export default class GoogleController {

  constructor() {
    console.log("Created new Google Controller");

    // Initialise Google Tasks client
    this.tasks = google.tasks('v1');

    // Create a new OAuth2 client with the configured keys.
    this.oauth2Client = new google.auth.OAuth2(
      keys.client_id,
      keys.client_secret,
      keys.redirect_uris[1]
    );

    // Tasks retrieved -> [ID, GoogleTask]
    this.retrievedTasks = new Map();

    // Permission scopes
    this.scopes = [
      'https://www.googleapis.com/auth/tasks',
      'https://www.googleapis.com/auth/tasks.readonly',
      'profile',
    ];
  }

  /**
   * Configure OAuth2 client and authenticate
   */
  async configure() {
    // Update OAuth2 client with new refresh token
    this.oauth2Client.on('tokens', (tokens) => {
      if (tokens.refresh_token) {
        keys.refresh_token = tokens.refresh_token;

        fs.writeFile(filePath, JSON.stringify(keys, null, 2), function writeJSON(err) {
          if (err) {
            return console.log(err);
          }
        });

        console.log("Updated Refresh Token: " + tokens.refresh_token);
      }
      console.log("Access Token: " + tokens.access_token);
    });

    google.options({ auth: this.oauth2Client });

    await this.authenticate(this.scopes)
      .catch(console.error);
    
    console.log("Google - OAuth client authenticated");
  }

  /**
   * Open an http server to accept the oauth callback.
   * @param {*} scopes - permission scopes required from user account
   * @returns OAuth client
   */
  async authenticate(scopes) {
    return new Promise((resolve, reject) => {
      // Check if a valid refresh token exists
      // TODO: may need to update IF statement -> may cause an error when attempting to authenticate w/ expired refresh token
      if (keys.refresh_token != "") {
        console.log("Found refresh token: " + keys.refresh_token);

        this.oauth2Client.setCredentials({
          refresh_token: keys.refresh_token
        });

        resolve(this.oauth2Client);
      } else {
        // grab the url that will be used for authorization
        const authorizeUrl = this.oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: scopes.join(' '),
        });

        const server = http
          .createServer(async (req, res) => {
            try {
              console.log(req.method, req.url);

              if (req.url.indexOf('/?code') > -1) {
                const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
                res.end('Authentication successful! Please return to the console.');

                server.destroy();

                const { tokens } = await this.oauth2Client.getToken(qs.get('code'));
                this.oauth2Client.setCredentials(tokens); // eslint-disable-line require-atomic-updates

                resolve(this.oauth2Client);
              }
            } catch (e) {
              reject(e);
            }
          })
          .listen(3000, 'localhost', () => {
            console.log(`Server is running`);

            // open the browser to the authorize url to start the workflow
            open(authorizeUrl, { wait: false }).then(cp => cp.unref());
          });
        
        destroyer(server);
      }
    });
  }

  // GET: all tasks in a list
  async getTasks() {
    const res = await this.tasks.tasks.list({
      showCompleted: true,
      showHidden: true,
      tasklist: process.env.GOOGLE_TEST_TASK_LIST
    });

    this.parseResponse(res.data);

    // ? possibly return map here?
    return this.retrievedTasks;
  }

  parseResponse(data) {
    const results = data.items;

    results.forEach(item => {
      let id = item.id;
      let title = item.title;
      let notes = ('notes' in item) ? item.notes : null;
      let status = item.status;
      let due = ('due' in item) ? item.due : null;
      let completed = ('completed' in item) ? item.completed : null;
      let lastEdited = item.updated;
      let url = item.selfLink;

      let task = new GoogleTask(id, title, notes, status, due, completed, lastEdited, url);
      task.formatProperties();
      task.toString();

      this.retrievedTasks.set(id, task);
    });
  }

}
