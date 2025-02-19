// controllers/productController.js

const Product = require("../model/Product");
const { validationResult } = require("express-validator");

// Add new product
const addProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, price, quantity } = req.body;

  try {
    const product = new Product({ name, price, quantity });
    await product.save();

    res.status(201).json({ msg: "Product added successfully", product });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Update product (e.g., price or quantity)
const updateProduct = async (req, res) => {
  const { price, quantity } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { price, quantity }, { new: true });
    if (!product) return res.status(404).json({ msg: "Product not found" });

    res.json({ msg: "Product updated successfully", product });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Sell product (decrease quantity)
const sellProduct = async (req, res) => {
  const { productId, quantitySold } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    if (product.quantity < quantitySold) return res.status(400).json({ msg: "Not enough stock" });

    product.quantity -= quantitySold;

    await product.save();

    res.json({ msg: "Product sold successfully", product });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports = { addProduct, updateProduct, sellProduct };
