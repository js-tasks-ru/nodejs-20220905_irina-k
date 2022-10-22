const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      /** Проверяем корректность маршрута. */
      const lastIndex = pathname.lastIndexOf('/');
      if (lastIndex !== -1 && lastIndex !== 0) {
        res.statusCode = 400;
        res.end('Incorrect path');
        return;
      } else {
        /** Проверяем, присутствует ли файл. */
        if (!fs.existsSync(filepath)) {
          res.statusCode = 404;
          res.end('No file');
          return;
        } else {
          /** Удаляем файл. */
          fs.unlink(filepath, (error) => {
            if (error) {
              res.statusCode = 500;
              res.end('Strange Error');
            } else {
              res.end('Your file was deleted');
            }
            return;
          });
        }
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
