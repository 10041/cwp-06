const fs = require("fs");

var instance;
module.exports = class UnitOfWork {
    constructor(){
        this.articles = JSON.parse(fs.readFileSync("./articles.json"));
    }
    static getInstance(){
        if(instance === undefined) instance = new UnitOfWork();
        return instance;
    }
    static commit(){
        const articlePath = "./articles.json";
		fs.truncate(articlePath, () => {
            fs.writeFile(articlePath, JSON.stringify(instance.articles));
        });
    }
}