const mapProduct = require('../mappers/product');
const Product = require('../models/Product');
const {isValidObjectId} = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;
  if (!subcategory) return next();
  const products = await Product.find({subcategory});
  const updatedProducts = products.map(mapProduct);

  ctx.body = {
    products: updatedProducts,
  };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  const updatedProducts = products.map(mapProduct);
  ctx.body = {
    products: updatedProducts,
  };
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;
  if (isValidObjectId(id)) {
    const productById = await Product.findById(id);

    if (productById === null) {
      ctx.status = 404;
      return;
    }
    const updatedProduct = mapProduct(productById);
    ctx.body = {
      product: updatedProduct,
    }
    return;
  };
  ctx.status = 400;
};

