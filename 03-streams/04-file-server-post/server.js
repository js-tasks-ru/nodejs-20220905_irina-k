const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      /** Проверка на правильность маршрута. */
      const lastIndex = url.pathname.lastIndexOf('/');
      if (lastIndex !== 0) {
        res.statusCode = 400;
        res.end('Incorrect path');
        return;
      }

      fs.open(filepath, 'wx', (err) => {
        if (err) {
          /** Проверка наличия файла. */
          if (err.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('The file exists');
            return;
          }
          throw err;
        } else {
          /** Если файла не существует, то стараемся создать его. */
          req.on('data', function(chunk) {
            const limitedStream = new LimitSizeStream({ limit: 1024, encoding: 'utf-8' }).on('error', (error) => {
              if (error) {
                if (error.code === 'LIMIT_EXCEEDED') {
                  res.statusCode = 413;
                  /** Удаляем файл. */
                  fs.unlink(filepath, (error) => {
                    if (error) {
                      console.log(error);
                    }
                  });
                }
              }
            });
            limitedStream.write(chunk.toString(), 'utf-8', (error) => {
              console.log(error);
            });
          });

          req.on('error', function(error) {
            if (error) {
              console.log('error');
              res.end('Error');
              return;
            }
          });

          req.on('close', function() {
            console.log('close');
            res.end('Closed');
            return;
          });

          req.on('finish', function() {
            res.statusCode = 201;
            res.end('Finished');
          });
        }
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
