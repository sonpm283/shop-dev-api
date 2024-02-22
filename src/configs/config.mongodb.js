"use strict";

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    host: process.env.DEV_DB_HOST || "127.0.0.1",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "dbDev",
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    host: process.env.PRO_DB_HOST || "127.0.0.1",
    port: process.env.PRO_DB_PORT || 27017,
    name: process.env.PRO_DB_NAME || "dbProduct",
  },
};

// nếu env.NODE_ENV không tồn tại thì sẽ lấy môi trường dev
const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";

// export config tuỳ theo môi trường
console.log(config[env], env);
module.exports = config[env];
