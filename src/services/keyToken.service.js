"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      // luu publicKey, privateKey vao db
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey,
        privateKey
      });

      //neu tao thanh cong thi tra ve publicKey
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.log(error);
      return error;
    }
  };
}

module.exports = KeyTokenService;
