const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const {user} = ctx;
  const {id} = user;
  try {
    const messages = await Message.find({chat: id}).limit(20);
    const updatedMessages = messages.map(mapMessage);
    ctx.body = {messages: updatedMessages};
  } catch (err) {
    throw err;
  }
};
