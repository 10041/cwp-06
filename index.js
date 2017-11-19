const http = require('http');
const url = require('url');

const{Log, CreateLogObjFromReq} = require("./logger")
const {Check} = require("./check");
const error = require("./error");

const hostname = '127.0.0.1';
const port = 3000;
const {
	getAllArticles,
	readArticleById,
	createArticle,
	updateArticle,
  deleteArticle,
  createComment,
  deleteComment,
  requestInvalid
} = require("./articleAction");

const handlers = {
    "/api/articles/readall": getAllArticles,
	"/api/articles/read": readArticleById,
	"/api/articles/create": createArticle,
	"/api/articles/update": updateArticle,
	"/api/articles/delete": deleteArticle,
	"/api/comments/create": createComment,
  "/api/comments/delete": deleteComment,
  "/api/error/400": requestInvalid
};

const server = http.createServer((req, res) => {
  parseBodyJson(req, (err, payload) => {
    const handler = getHandler(req.url);

    handler(req, res, payload, (err, result) => {
      if (err) {
        res.statusCode = err.code;
        res.setHeader('Content-Type', 'application/json');
        res.end( JSON.stringify(err) );

        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end( JSON.stringify(result) );
    });
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function getHandler(url) {
  return handlers[url] || notFound;
}


function notFound(req, res, payload, cb) {
  cb({ code: 404, message: 'Not found'});
}

function parseBodyJson(req, cb) {
  let body = [];

  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    
    let params = (req.method === "GET") ? parseGetRequest(req) : JSON.parse(body);
    Log(CreateLogObjFromReq(req.url, params));
    if(!Check(req.url, params)){
      req.url = "/api/error/400";
      cb(error.INVALID_REQUEST, null);
    }
    else{
      cb(null, params);
    }
  });
}

function parseGetRequest(req) {
	let parseUrl = url.parse(req.url, true);
    req.url = parseUrl.pathname;
	return parseUrl.query;
}
