import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import http from 'http';
import url from 'url';
import open from 'open';
import destroyer from 'server-destroy';

import { Client } from '@notionhq/client';
import { google } from 'googleapis';

dotenv.config();

const __dirname = path.resolve();

const notion = new Client({ auth: process.env.NOTION_KEY });

const databaseId = process.env.NOTION_TEST_DATABASE_ID;

(async () => {
  const response = await notion.databases.query({
    database_id: databaseId
  });
  console.log(response);
})();

(async () => {
  const blockId = 'eaf355e7-de64-4f00-b062-f29f93ba10b7';
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });
  console.log(response);
})();

// --------------------------------------------------------------------------------------------

const tasks = google.tasks('v1');

const filePath = process.env.GOOGLE_CREDENTIALS_FILE
const rawKeys = fs.readFileSync(filePath);
const keys = JSON.parse(rawKeys);

/**
 * Create a new OAuth2 client with the configured keys.
 */
const oauth2Client = new google.auth.OAuth2(
  keys.client_id,
  keys.client_secret,
  keys.redirect_uris[1]
);

oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    keys.refresh_token = tokens.refresh_token;
    fs.writeFile(filePath, JSON.stringify(keys, null, 2), function writeJSON(err) {
      if (err) return console.log(err);
      console.log(JSON.stringify(keys));
      console.log('writing to ' + filePath);
    });

    console.log("Refresh Token: " + tokens.refresh_token);
  }
  console.log("Access Token: " + tokens.access_token);
});

google.options({ auth: oauth2Client });

/**
 * Open an http server to accept the oauth callback.
 */
async function authenticate(scopes) {
  return new Promise((resolve, reject) => {
    if (keys.refresh_token != "") {
      console.log("Found refresh token: " + keys.refresh_token);
      oauth2Client.setCredentials({
        refresh_token: keys.refresh_token
      });
      resolve(oauth2Client);
    } else {
      // grab the url that will be used for authorization
      const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
      });

      const server = http
        .createServer(async (req, res) => {
          try {
            console.log(authorizeUrl);
            console.log(req.method, req.url);

            if (req.url.indexOf('/?code') > -1) {
              const qs = new url.URL(req.url, 'http://localhost:3000')
                .searchParams;
              console.log(qs);
              res.end('Authentication successful! Please return to the console.');
              server.destroy();
              const { tokens } = await oauth2Client.getToken(qs.get('code'));
              oauth2Client.setCredentials(tokens); // eslint-disable-line require-atomic-updates
              resolve(oauth2Client);
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

async function runSample() {
  const res = await tasks.tasks.list({
    tasklist: 'MW96S2E2ci1OaTJ6a0VoYw'
  })
  console.log(res.data);
}

const scopes = [
  'https://www.googleapis.com/auth/tasks',
  'https://www.googleapis.com/auth/tasks.readonly',
  'profile',
];

authenticate(scopes)
  .then(client => runSample(client))
  .catch(console.error);