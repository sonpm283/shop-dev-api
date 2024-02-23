"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      // luu publicKey vao db
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });

      //neu tao thanh cong thi tra ve publicKey
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
