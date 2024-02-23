"use strict";

const { RoleShop } = require("../constants/roles");
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData} = require("../utils");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      //STEP 1: check email exists
      // kiểm tra email đã tồn tại chưa
      // lean() để chuyển từ mongoose object sang javascript object nên sẽ nhanh hơn
      const holderShop = await shopModel.findOne({ email }).lean();
      // early return when email exists
      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop elready registered!",
        };
      }

      //STEP 2: create new shop
      // shopModel.create() để tạo mới 1 shop
      // hash password bằng bcrypt (install 'bcrypt' pagkage)
      // tham số thứ 2 là số vòng lặp để tạo ra chuỗi hash
      // càng lớn thì càng phức tạp, tuy nhiên sẽ tốn nhiều thời gian hơn
      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      //STEP 3: create accecs token and refresh token
      if (newShop) {
        // created privateKey and publicKey by crypto
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        console.log({ privateKey, publicKey });
        // sau khi tạo thành công privateKey và publicKey thì lưu publicKey vào db
        // bằng cách gọi hàm createKeyToken từ KeyTokenService
        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "publicKeyString error",
          };
        }

        console.log(`Public Key String: ${publicKeyString}`);

        const pubLishKeyObejct = crypto.createPublicKey(publicKeyString);

        console.log(`Public Key Object: ${pubLishKeyObejct}`);
        // tạo access token và refresh token
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          pubLishKeyObejct,
          privateKey
        );

        console.log("Created Token Success", tokens);

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              object: newShop,
              fileds: ["_id", "name", "email"],
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
