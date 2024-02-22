"use strict";

const os = require("os");
const process = require("process");
const mongoose = require("mongoose");
const _SECONDS = 5000;

//check số lượng kết nối đến database
const countConnect = () => {
  const numConnect = mongoose.connections.length;
  console.log(`Number of connections::${numConnect}`);
};

// check kết nối quá tải
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length; // số lượng kết nối đến db
    const numCores = os.cpus().length; // kiểm tra số nhân cpu
    const memoryUsage = process.memoryUsage().rss;
    // ví dụ mỗi cores chỉ được 5 connection thì 8 core -> 40 connection
    const maxConnections = numCores * 5;

    console.log(`Active connections:${numConnection}`);
    console.log(`Memory usage:::${memoryUsage / 1024 / 1024} MB`); // tính ra MB

    if (numConnection > maxConnections) {
      console.log(`Connection overload detected`);
      // bắn cảnh báo
      // notify.send(...)
    }
  }, _SECONDS); // Monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
