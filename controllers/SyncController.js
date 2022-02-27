import NotionController from './NotionController.js';
import GoogleController from './GoogleController.js';

import NotionTask from '../models/NotionTask.js';
import GoogleTask from '../models/GoogleTask.js';

/**
 * TODO: create data collection for tasks
 *  - matching list
 *  - unmatched Notion items
 *  - unmatched Google items
 */

export default class SyncController {

  constructor() {
    console.log("Created new Sync Controller");

    // Initialise controllers
    this.notionController = new NotionController();
    this.googleController = new GoogleController();
  }

  async sync() {
    // Get tasks from controllers in parallel
    await this.notionController.getTasks();
    await this.googleController.configure();
    // Wait for both tasks to finish
    // Compare retrieved lists -> generate 3 lists
    // Resolve lists
    // Clean up
  }
}