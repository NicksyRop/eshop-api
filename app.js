const express = require("express");

const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const morgan = require("morgan");
app.use(morgan("tiny"));
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const api = process.env.API_URL;

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
