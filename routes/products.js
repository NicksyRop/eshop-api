const router = require("express").Router();
const Category = require("../model/Category");
const Product = require("../model/Product");
const mongoose = require("mongoose");

//create new product
router.post("/", async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) return res.status(400).send("Invalid category");
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    images: req.body.images,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numRevies: req.body.numRevies,
    isFeatured: req.body.isFeatured,
    countInStock: req.body.countInStock,
  });

  try {
    const savedProduct = await product.save();
    if (!savedProduct) {
      return res.status(500).json("product cannot be created");
    }
    res.status(200).json(savedProduct);
  } catch (error) {
    res.status(500).json(error);
  }
});

//fetch all products

router.get("/", async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  try {
    // display specisic fileds
    // const products = await Product.find().select("name image");

    const products = await Product.find({ filter }).populate("category");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get single product
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    return res.status(404).send("No product found");
  }

  res.status(200).json(product);
});

//updating a product

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid product id");
  }
  const category = await Category.findById(req.body.category);

  if (!category) return res.status(400).send("Invalid category");
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!product) {
    return res.status(500).send("Product cannot be updated");
  }

  res.status(200).json(product);
});

//deleting a product

router.delete("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid product id");
  }

  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product) return res.status(404).send("No product found");

  res.status(200).send("Product deleted");
});

//get product count

router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) return res.status(500).json({ success: false });

  res.status(200).json({
    count: productCount,
  });
});

//get featured products

router.get("/get/featured/:count?", async (req, res) => {
  const count = req.params.count;

  if (count) {
    const featuredProduct = await Product.find({ isFeatured: true }).limit(
      count
    );
    res.status(200).json(featuredProduct);
  } else {
    const featuredProduct = await Product.find({ isFeatured: true });

    res.status(200).json(featuredProduct);
  }
});

module.exports = router;
