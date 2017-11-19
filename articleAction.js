const unit = require("./UnitOfWork");
const error = require("./error");
const Article = require("./models/articleModel");
const Comment = require("./models/commentModel");

module.exports = class articleAndCommentAction{

    static getAllArticles(req, res, payload, cb) 
    {
        cb(null, unit.getInstance());
    }
    static readArticleById(req, res, payload, cb) 
    {
        let result = unit.getInstance().articles.filter((item) => {
            return item.id == payload.id;
        });
        result != undefined ? cb(null, result) : cb(error.ITEM_NOT_FOUND, null);
    }
    static createArticle(req, res, payload, cb) 
    {
        let article = new Article(payload.title, payload.text, payload.date, payload.author);
        unit.getInstance().articles.push(article);
        cb(null, article);
        unit.commit();
    }
    static updateArticle(req, res, payload, cb) 
    {
        let article = new Article(payload.title, payload.text, payload.date, payload.author);
        unit.getInstance().articles.forEach((item, index) => {
            if (item.id == payload.id) {
                let obj = unit.getInstance().articles[index];
                obj.title = article.title;
                obj.text = article.text;
                obj.date = article.date;
                obj.author = article.author;
                unit.getInstance().articles[index] = obj;
            }
        });
        let result = unit.getInstance().articles.find(item => item.id == payload.id);
        result != undefined ? cb(null, result) : cb(error.ITEM_NOT_FOUND, null);
        unit.commit();
    }
    static deleteArticle(req, res, payload, cb) 
    {
        let result = unit.getInstance().articles.find(item => item.id == payload.id);
        if (result !== undefined) {
            unit.getInstance().articles = unit.getInstance().articles.filter(item => item.id != payload.id);
        }
        result !== undefined ? cb(null, result) : cb(error.ITEM_NOT_FOUND, null);
        unit.commit();
    }
    
    static createComment(req, res, payload, cb) 
    {
        let comment = new Comment(payload.articleId, payload.text, payload.date, payload.author);
        unit.getInstance().articles.forEach(item => {
            if (item.id == payload.articleId) {
                item.comments.push(comment);
            }
        });
        cb(null, comment);
        unit.commit();
    }
    static deleteComment(req, res, payload, cb) 
    {
        let result;
        unit.getInstance().articles.forEach((item, index) => {
            if (item.id == payload.articleId){
                result = item.comments.find(item => item.commentId == payload.commentId);
                unit.getInstance().articles[index].comments = item.comments.filter(item => item.commentId != payload.commentId);
            }
        });
        result !== undefined ? cb(null, result) : cb(error.ITEM_NOT_FOUND, null);
        unit.commit();
    }
    static requestInvalid(req, res, payload, cb) {
		cb({ code: 400, message: "Request invalid" });
	}
}