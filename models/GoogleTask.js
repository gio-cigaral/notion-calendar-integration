export default class GoogleTask {

  constructor(id, title, notes, status, due, completed, lastEdited, url) {
    this.id = id;
    this.title = title;
    this.notes = notes;             // optional
    this.status = status;           // ['needsAction', 'completed']
    this.due = due;                 // optional
    this.completed = completed;     // optional
    this.lastEdited = lastEdited;
    this.url = url;
  }

  formatProperties() {
    // Split up notes -> Line 1 = Notion Project | Line 2 = Notion ID | Line 3 = Notion URL
    // ? main matching point should be Notion ID -> in that case is Notion Project still relevant?
    // * possible changes between sources should be in the [Task Title] and the [Task Due Date]
    let project = null;
    let id = null;
    let url = null;

    if (this.notes) {
      const noteProperties = this.notes.split(/\r?\n/);
      if (noteProperties.length > 0) project = noteProperties[0];
      if (noteProperties.length > 1) id = noteProperties[1];
      if (noteProperties.length > 2) url = noteProperties[2];
    }
    
    this.notionProject = project;
    this.notionId = id;
    this.notionUrl = url;
  }

  toString() {
    console.log("----------------------------------");
    console.log("GOOGLE TASK");
    console.log("   ID: " + this.id);
    console.log("   Title: " + this.title);
    console.log("   Notes: " + this.notes);
    console.log("   Status: " + this.status);
    console.log("   Due: " + this.due);
    console.log("   Completed: " + this.completed);
    console.log("   Last Edited: " + this.lastEdited);
    console.log("   URL: " + this.url);
    console.log("   NOTION PROPERTIES");
    console.log("       Project: " + this.notionProject);
    console.log("       ID: " + this.notionId);
    console.log("       URL: " + this.notionUrl);
    console.log("----------------------------------");
  }

}