const Guid = require("guid");

module.exports = class Comment {
	constructor(articleId, text, date, author) {
		this.commentId = Guid.create();
		this.articleId = articleId;
		this.text = text;
		this.date = date;
		this.author = author;
	}
}