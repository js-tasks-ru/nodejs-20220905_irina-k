const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;

const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const lastIndex = url.pathname.lastIndexOf('/');
      if (lastIndex !== 0) {
        res.statusCode = 400;
        res.end('Incorrect path');
        return;
      }
      try {
        await fsPromises.access(filepath, fs.constants.R_OK);
        res.statusCode = 409;
        res.end();
        return;
      } catch (error) {
        console.log(error);
      }

      const createCommonError = () => {
        res.statusCode = 500;
        res.end();
        return;
      };

      const writeStream = fs.createWriteStream(filepath);
      const limitedStream = new LimitSizeStream( {limit: 1048576} );

      req.pipe(limitedStream).pipe(writeStream);

      limitedStream.on('error', (error) => {
        if (error.code === 'LimitExceededError') {
          fsPromises.unlink(filepath);
          res.statusCode = 413;
          res.end();
          return;
        }
        createCommonError();
      });

      req.on('error', () => {
        createCommonError();
      });

      req.on('close', () => {
        if (req.readableAborted) {
          req.unpipe();
          res.end();
          return;
        }
      });

      writeStream.on('error', () => {
        createCommonError();
      });

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('Your file was created');
        return;
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
