const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const orderConfirmation = require('../mappers/orderConfirmation');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {phone, product, address} = ctx.request.body;
  const {user} = ctx;
  try {
    const order = new Order({phone, product, address, user});
    await order.save();
    const productInfo = await Product.findById(product);
    const orderInfo = orderConfirmation(product, productInfo);
    await sendMail({
      template: 'order-confirmation',
      locals: orderInfo,
      to: user.email,
    });
    ctx.body = {order: order.id};
  } catch (err) {
    throw err;
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const {user} = ctx;
  const orders = await Order.find({user}).populate('product');
  const modifiedOrders = orders.map(mapOrder);
  ctx.body = {orders: modifiedOrders};
};
