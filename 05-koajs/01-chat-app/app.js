const path = require('path');
const Koa = require('koa');
const app = new Koa();
const chat = require('./chat');

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise((resolve) => {
    chat.subscribe(resolve);
  });
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (message) {
    chat.publish(message);
    ctx.response.body = {
      result: 'Success',
    };
  } else {
    ctx.response.body = {
      result: 'Empty Message',
    };
  }
  ctx.response.status = 200;
});

app.use(router.routes());

module.exports = app;