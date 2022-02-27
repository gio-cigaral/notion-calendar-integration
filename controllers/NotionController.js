import { Client, LogLevel } from '@notionhq/client';

import NotionTask from '../models/NotionTask.js';

export default class NotionController {

  constructor() {
    console.log("Created new Notion Controller");
    
    // Initialise Notion client
    this.notion = new Client({ auth: process.env.NOTION_KEY });
    this.databaseId = process.env.NOTION_TEST_TASK_DATABASE_ID;

    // Tasks retrieved -> [ID, NotionTask]
    this.tasks = new Map();
  }

  async getTasks(){
    const response = await this.notion.databases.query({
      database_id: this.databaseId
    });

    console.log(response);
  }

  // GET: all pages in a database
  // (async () => {
  //   const response = await notion.databases.query({
  //     database_id: databaseId
  //   });
  //   console.log(response.results[1]);
  // })();

  // GET: all blocks of a page
  // (async () => {
  //   const blockId = 'eaf355e7-de64-4f00-b062-f29f93ba10b7';
  //   const response = await notion.blocks.children.list({
  //     block_id: blockId,
  //     page_size: 50,
  //   });
  //   console.log(response);
  // })();

}
