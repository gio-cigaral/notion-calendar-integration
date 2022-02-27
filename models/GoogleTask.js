export default class GoogleTask {

  constructor(id, title, notes, status, due, completed, lastEdited, url) {
    this.id = id;
    this.title = title;
    this.notes = notes;
    this.status = status;
    this.due = due;
    this.completed = completed;
    this.lastEdited = lastEdited;
    this.url = url;
  }

}