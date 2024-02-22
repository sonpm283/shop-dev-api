require('dotenv').config()
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const app = express();

// init middlewares
app.use(morgan("dev")); // dùng để ghi log(tiny, combined, short, common)
app.use(helmet()); // security
app.use(compression()); // giảm dung lượng của data khi vẫn chuyển dữ liệu

// init db
require("./dbs/init.mongodb");
const { checkOverload } = require("./helpers/check.connect");
checkOverload();

// init routes
app.get("/", (req, res, next) => {
  const strCompress = "Hello Tip Javascript";

  return res.status(200).json({
    message: "Hello Express",
    metadata: strCompress.repeat(10000),
  });
});

// handling error

module.exports = app;
