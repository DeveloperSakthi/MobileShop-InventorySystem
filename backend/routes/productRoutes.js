const express = require("express");
const { addProduct, updateProduct, sellProduct } = require("../controllers/productController");
const { check } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../model/Product");
const Transaction = require("../model/Transaction");

const router = express.Router();

// Add Product (Admin only)
router.post(
  "/add",
  authMiddleware,
  [
    check("name", "Product name is required").not().isEmpty(),
    check("price", "Price must be a number").isNumeric(),
    check("quantity", "Quantity must be a number").isNumeric(),
  ],
  addProduct
);

// Get All Products (Accessible by both admin and staff)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Update Product (Admin only)
router.put(
  "/update/:id",
  authMiddleware,
  [
    check("price", "Price must be a number").isNumeric().optional(),
    check("quantity", "Quantity must be a number").isNumeric().optional(),
  ],
  updateProduct
);

// Delete Product (Admin only)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied" });

  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Sell Product (Staff only)
router.post(
  "/sell",
  authMiddleware,
  [
    check("productId", "Product ID is required").not().isEmpty(),
    check("quantitySold", "Quantity must be a number").isNumeric(),
  ],
  sellProduct
);

// Get All Transactions (Admin only)
router.get("/transactions", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied" });

  try {
    const transactions = await Transaction.find().populate("product");
    res.json(transactions);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;