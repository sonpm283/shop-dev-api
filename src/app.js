require("dotenv").config();
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
var cors = require("cors");
const app = express();

// init middlewares
app.use(morgan("dev")); // dùng để ghi log(tiny, combined, short, common)
app.use(helmet()); // security
app.use(compression()); // giảm dung lượng của data khi vẫn chuyển dữ liệu
app.use(express.json()); // parse json
app.use(express.urlencoded({ extended: true })); // parse urlencoded
app.use(cors()); // cors

// init db
require("./dbs/init.mongodb");

// kiểm tra overload mỗi 5 giây
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

// init routes
app.use("/", require("./routes"));
// handling error
// các lỗi này sẽ được xử lý bên dưới router
// 404 not found
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
