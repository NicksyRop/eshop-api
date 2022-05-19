const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const morgan = require("morgan");
var jwt = require("express-jwt");
const errorHandler = require("./helper/error");
//app.use(errorHandler);

//destroy token if not admin for the rest of the routes
async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}

//middleware to protect server from anathorized users
app.use(
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    isRevoked: isRevoked, // revokes token if the user is not admin so that user cannot update
  }).unless({
    //paths that are not protected any user can access ie admin and not admin

    path: [
      "/api/v1/users/login",
      "/api/v1/users/register",
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },

      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
    ],
  })
);

//error handling

const cors = require("cors");
const authJwt = require("./helper/error");

app.use(morgan("tiny"));

app.use(authJwt);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.use(cors());
app.options("*", cors());

//routes
const productRouter = require("./routes/products");
const categoryRouter = require("./routes/categories");
const userRouter = require("./routes/users");
const orderRouter = require("./routes/orders");
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongo Db connected successfully"))
  .catch((e) => console.log(e));
const api = process.env.API_URL;

app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
