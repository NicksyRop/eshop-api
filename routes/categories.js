const Category = require("../model/Category");
const express = require("express");
const router = express.Router();

//get all categories
router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

//create
router.post("/", async (req, res) => {
  const category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });

  try {
    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete category

router.delete("/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: "category deleted",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
    })
    .catch((error) => {
      return res.status(400).json({ success: false, error: error });
    });
});
//update category

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icom: req.body.icom,
        color: req.body.color,
      },
      {
        new: true,
      }
    );

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get category

router.get("/:id", async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);

    if (!cat) {
      return res.status(404).send({ message: "No category matching the Id" });
    }

    res.status(200).send(cat);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
