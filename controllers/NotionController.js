import { Client, LogLevel } from '@notionhq/client';

import NotionTask from '../models/NotionTask.js';

export default class NotionController {

  constructor() {
    console.log("Created new Notion Controller");
    
    // Initialise Notion client
    this.notion = new Client({ auth: process.env.NOTION_KEY });
    this.databaseId = process.env.NOTION_TEST_TASK_DATABASE_ID;

    // Tasks retrieved -> [ID, NotionTask]
    this.retrievedTasks = new Map();
  }

  async getTasks() {
    const response = await this.notion.databases.query({
      database_id: this.databaseId
    });

    this.parseResponse(response);

    // ? possibly return map here?
    return this.retrievedTasks;
  }

  parseResponse(data) {
    const results = data.results;

    results.forEach(item => {
      let id = item.id;
      let properties = item.properties;
      let lastEdited = item.last_edited_time;
      let url = item.url;

      let task = new NotionTask(id, properties, lastEdited, url);
      task.formatProperties();
      task.toString();

      this.retrievedTasks.set(id, task);
    });
  }

}
