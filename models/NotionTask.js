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
        case "Name":
          this.title = value.title.plain_text;
          break;
        case "Project":
          this.project = value.multi_select;
          break;
        case "Due Date":
          this.date = value.date.start;
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

}