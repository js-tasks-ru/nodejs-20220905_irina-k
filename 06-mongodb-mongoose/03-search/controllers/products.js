const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

const createProductsList = (res) => {
  const list = res.map((p) => mapProduct(p));
  return list;
}

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
const {query} = ctx.query;
if (!query) {
  await Product.find({}).then((res) => {
    if (res.length) {
      const products = createProductsList(res);
      ctx.body = {products};
    } else {
      ctx.body = {products: []};
    }
  })
} else if (query) {
  await Product.find({$text: {$search: query}}).then((res) => {
    if (res.length) {
      const products = createProductsList(res);
      ctx.body = {products};
    } else {
      ctx.body = {products: []};
    }
  });
}};
