"use strict";

// Singleton pattern
const mongoose = require("mongoose");
const {
  //destructuring của key db
  db: { host, port, name },
} = require("../configs/config.mongodb");
const connectString = `mongodb://${host}:${port}/${name}`;

// check số lượng connect đến database
const { countConnect } = require("../helpers/check.connect");

console.log(`connectString:`, connectString);
class Database {
  constructor() {
    this.connect();
  }

  //connect
  connect(type = "mongodb") {
    // nếu dev thì in ra log còn product thì thôi
    if (process.env.NODE_ENV !== 'pro') {
      // in lại tất cả các hoạt động khi query
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50, // cho phép 50 connect, khi vượt quá 50 connect thì sẽ rơi vào hàng đợi
      })
      .then((_) => {
        console.log(`Connected Mongodb Success`, countConnect());
      })
      .catch((err) => console.log(`Error Connect`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
