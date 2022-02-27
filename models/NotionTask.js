export default class NotionTask {
  
  constructor(id, properties, lastEdited, url) {
    this.id = id;
    this.properties = properties;
    this.lastEdited = lastEdited;
    this.url = url;
  }

  /**
   * Parses the properties object retrieved from the Notion API
   */
  formatProperties() {
    // TODO: extension -> create a mapper that checks (any) property type and finds the correct attribute for the value and saves the key+value pair
    // value[key]?
    // * For now only the required properties will be included and will be hardcoded in

    for (const [key, value] of Object.entries(this.properties)) {
      switch(key) {
        case "Task Name":
          this.title = (value.title.length) ? value.title[0].plain_text : null;
          break;
        case "Project":
          this.project = (value.multi_select.length) ? value.multi_select[0].name : null;
          break;
        case "Due Date":
          this.date = (value.date) ? value.date.start : null;
          break;
        case "Refined":
          this.refined = value.checkbox;
          break;
        case "Done":
          this.done = value.checkbox;
          break;
      }
    }
  }

  toString() {
    console.log("----------------------------------");
    console.log("NOTION TASK");
    console.log("   ID: " + this.id);
    console.log("   Last Edited: " + this.lastEdited);
    console.log("   URL: " + this.url);
    console.log("   Title: " + this.title);
    console.log("   Project: " + this.project);
    console.log("   Date: " + this.date);
    console.log("   Refined: " + this.refined);
    console.log("   Done: " + this.done);
    console.log("----------------------------------");
  }

}