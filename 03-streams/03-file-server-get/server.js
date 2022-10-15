const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs')
const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      try {
        const lastIndex = url.pathname.lastIndexOf('/');
        if (lastIndex !== 0) {
          res.statusCode = 400;
          res.end('Incorrect path');
          return;
        }
        if (!fs.existsSync(filepath)) {
          res.statusCode = 404;
          res.end('No file');
          return;
        } else {
          fs.createReadStream(filepath).pipe(res);
        }
      } catch (error) {
        res.statusCode = 500;
        res.end('Strange error');
      }
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
