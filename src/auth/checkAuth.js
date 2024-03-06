"use strict";

const { findById } = require("../services/apiKey.service");
const { HEADER } = require("../utils/constants");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    // nếu không có key thì trả về 403
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    // check objkey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(404).json({
        message: "Forbidden Error",
      });
    }

    // gán objKey vào req để sử dụng ở middleware tiếp theo
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
  }
};

// check permission
const permission = (permission) => {
  return async (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    console.log("permission::", req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
