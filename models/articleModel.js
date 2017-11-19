const Guid = require("guid");

module.exports = class Article {
	constructor(title, text, date, author) {
		this.id = Guid.create().value;
		this.title = title;
		this.text = text;
		this.date = date;
		this.author = author;
		this.comments = [];
	}
}