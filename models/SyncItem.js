import NotionTask from "./NotionTask";
import GoogleTask from "./GoogleTask";

export default class SyncItem {

  constructor(status, notionTask, googleTask) {
    this.status = status;             // ['synced', 'conflict']
    this.notionTask = notionTask;
    this.googleTask = googleTask;
  }

}