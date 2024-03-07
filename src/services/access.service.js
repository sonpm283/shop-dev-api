"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { RoleUser } = require("../utils/constants");
const { BadRequestError } = require("../core/error.response");

class AccessService {

  // Login
  static login = async({email, password}) => {
    //STEP 1: check email exists
    const holderUser = await userModel.findOne({  email }).lean();
    if(!holderUser) throw BadRequestError("");
  }

  //  Sign Up
  static signUp = async ({ name, email, password }) => {
    //STEP 1: check email exists
    // kiểm tra email đã tồn tại chưa
    // lean() để chuyển từ mongoose object sang javascript object nên sẽ nhanh hơn
    const holderUser = await userModel.findOne({ email }).lean();
    // early return when email exists
    if (holderUser) {
      throw new BadRequestError("Error: User already registered!")
    }

    //STEP 2: create new user
    
    // userModel.create() để tạo mới 1 user
    // hash password bằng bcrypt (install 'bcrypt' pagkage)
    // tham số thứ 2 là số vòng lặp để tạo ra chuỗi hash
    // càng lớn thì càng phức tạp, tuy nhiên sẽ tốn nhiều thời gian hơn
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleUser.USER],
    });

    //STEP 3: create accecs token and refresh token
    if (newUser) {
      // created privateKey and publicKey by crypto
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      // tạo privateKey và publicKey bằng crypto đơn giản hơn cách trên
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey });
      // sau khi tạo thành công privateKey và publicKey thì lưu publicKey vào db
      // bằng cách gọi hàm createKeyToken từ KeyTokenService

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: "xxx",
          message: "publicKeyString error",
        };
      }

      // tạo access token và refresh token
      const tokens = await createTokenPair(
        { userId: newUser._id, email },
        publicKey,
        privateKey
      );

      console.log("Created Token Success", tokens);

      return {
        code: 201,
        metadata: {
          user: getInfoData({
            object: newUser,
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
  };
}

module.exports = AccessService;
