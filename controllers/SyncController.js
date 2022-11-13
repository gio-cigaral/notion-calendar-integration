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
    // Configure and authenticate Google OAuth 2.0 client
    await this.googleController.configure();

    // Get tasks from controllers in parallel
    // Wait for both tasks to finish
    let [notionResult, googleResult] = await Promise.all([
      this.notionController.getTasks(),
      this.googleController.getTasks()
    ]);

    console.log("NOTION RESULT: " + notionResult);
    console.log("GOOGLE RESULT: " + googleResult);

    // Compare retrieved lists -> generate 3 lists
    /**
     * Steps:
     *  1) Iterate over one map (choose any - maybe the longest?) and do a comparison
     *  2) Based on comparison move item(s) to 1 of 3 new maps
     *  3) IF the shorter map is chosen - place the leftover items of the longer map into the relevant map
     */
    for (const [notionKey, notionVal] of notionResult.entries()) {
      for (const [googleKey, googleVal] of googleResult.entries()) {
        
      }
    }

    // Resolve lists
    

    // Clean up

  }

  compare(notionTask, googleTask) {
    
  }
}