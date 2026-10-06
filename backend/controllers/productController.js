const Product = require("../models/Product");

// @desc    Add product
// @route   POST /addproduct or /api/products/addproduct
// @access  Public (or Admin)
const addProduct = async (req, res, next) => {
  try {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
      let last_product = products[products.length - 1];
      id = last_product.id + 1;
    } else {
      id = 1;
    }

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    console.log("Saving Product:", product);
    await product.save();
    console.log("Product Saved Successfully!");

    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product
// @route   POST /removeproduct or /api/products/removeproduct
// @access  Public (or Admin)
const removeProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });
    if (!deletedProduct) {
      return res.status(404).json({ success: false, errors: "Product not found" });
    }
    console.log("Product Removed");
    res.json({
      success: true,
      name: req.body.name || deletedProduct.name,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
// @route   GET /allproducts or /api/products/allproducts
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    let products = await Product.find({});
    console.log("All Products fetched successfully!");
    res.send(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get new collections
// @route   GET /newcollections or /api/products/newcollections
// @access  Public
const getNewCollections = async (req, res, next) => {
  try {
    let products = await Product.find({});
    let newcollection = products.slice(-8);
    console.log("New Collections fetched");
    res.send(newcollection);
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular products in women category
// @route   GET /popularinwomen or /api/products/popularinwomen
// @access  Public
const getPopularInWomen = async (req, res, next) => {
  try {
    let products = await Product.find({ category: "Women" });
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
  removeProduct,
  getAllProducts,
  getNewCollections,
  getPopularInWomen,
};
