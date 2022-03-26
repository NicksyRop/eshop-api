const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const morgan = require("morgan");
app.use(morgan("tiny"));

const productRouter = require("./routes/products");
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongo Db connected successfully"))
  .catch((e) => console.log(e));
const api = process.env.API_URL;

app.use(`${api}/products`, productRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
