const router = require("express").Router();
const Product = require("../model/Product");

//create new product
router.post("/", (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save()
    .then((savedProduct) => {
      res.status(201).json(savedProduct);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
