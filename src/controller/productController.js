// const { Route53Resolver } = require("aws-sdk");
const productModel = require("../models/productModel");
const { uploadFiles } = require("../upload/upload");

const {
  isValidRequest,
  isValidString,
  isValidTitle,
  isValidprice,
  isValidName,
  isValidSize,
  isValidMail,
  isValidPhone,
  isValidPassword,
  isValidPincode,
  isValidId,
  isValidValue,
} = require("../validator/validation");

const mongoose = require("mongoose");
const { findOneAndUpdate, findById } = require("../models/productModel");

// =========================================================CREATE PRODUCT API=========================================================

const createProduct = async function (req, res) {
  try {
    //Validating request body
    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid input" });
    }
    //Destructuring
    let {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      style,
      availableSizes,
      installments,
    } = req.body;

    //Storing file to a variable
    productImage = req.files;
    //Creating Blank object
    let productData = {};

    //Validating title
    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: "Ttile is required" });
    }
    if (!isValidString(title) && !isValidTitle(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid title" });
    }
    const isDuplicateTitle = await productModel.findOne({ title: title });
    if (isDuplicateTitle) {
      return res
        .status(409)
        .send({ status: false, message: `${title} title is already in use` });
    }

    productData.title = title;

    //Validating description
    if (!description) {
      return res
        .status(400)
        .send({ status: false, message: "description is frequired" });
    }
    if (!isValidString(description)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid description" });
    }
    productData.description = description;

    //Validating price
    if (!price) {
      return res
        .status(400)
        .send({ status: false, message: "Price is required" });
    }
    if (!isValidprice(price)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid price" });
    }
    productData.price = price;

    //Validating currencyId if given

    if (currencyId) {
      if (!["INR"].includes(currencyId)) {
        return res.status(400).send({
          status: false,
          message: "Enter valid currency abbreviation of Indian rupee ",
        });
      }
      productData.currencyId = currencyId;
    }

    //Validating currencyFormat if given

    if (currencyFormat) {
      if (!["₹"].includes(currencyFormat)) {
        return res.status(400).send({
          status: false,
          message: "Enter valid currency format of Indian rupee ",
        });
      }
      productData.currencyFormat = currencyFormat;
    }

    //Validating isFreeShipping if given

    if (isFreeShipping) {
      if (!["true", "false"].includes(isFreeShipping)) {
        return res.status(400).send({
          status: false,
          message: "isFreeShipping should be a boolean value",
        });
      }
      productData.isFreeShipping = isFreeShipping;
    }

    //Validating product image
    if (productImage.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Product image is required" });
    }
    let match = /\.(jpeg|png|jpg)$/.test(productImage[0].originalname);
    if (match == false) {
      return res.status(400).send({
        status: false,
        message: "Product image is required in jpeg|png|jpg format",
      });
    }
    let uploadedFileURL = await uploadFiles(productImage[0]);
    productData.productImage = uploadedFileURL;

    // Validating style if given

    if (style) {
      if (!isValidString(style) || !isValidName(style)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid style" });
      }
      productData.style = style;
    }

    // Validating available sizes
    if (!availableSizes) {
      return res
        .status(400)
        .send({ status: false, message: "size is required" });
    }

    if (!isValidSize(availableSizes)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid size as per Enum" });
    }
    availableSizes = availableSizes.split(",").map((x) => x.trim());
    productData.availableSizes = availableSizes;

    //Validating installments if given
    if (installments) {
      if (/^[0-9]+$/.test(installments) == false) {
        return res.status(400).send({
          status: false,
          message: "Enter valid amount for installments",
        });
      }
      productData.installments = installments;
    }

    const createdProduct = await productModel.create(productData);
    return res
      .status(201)
      .send({ status: true, message: "success", data: createdProduct });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// =========================================================GET PRODUCT API==================================================================

const getProducts = async function (req, res) {
  try {
    let { size, name, priceGreaterThan, priceLessThan, priceSort } = req.query;
    let searchCondition = { isDeleted: false };

    //Validating size if given
    if (size) {
      if (!isValidSize(size)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid size " });
      }
      size = size.split(",").map((x) => x.trim());
      searchCondition.availableSizes = { $in: size };
    }

    //Validating name if given
    if (name) {
      if (!isValidString(name) || !isValidTitle(name)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid name" });
      }
      searchCondition.title = { $regex: name };
    }

    if (priceGreaterThan && priceLessThan) {
      searchCondition.price = { $gt: priceGreaterThan, $lt: priceLessThan };
    } else {
      if (priceGreaterThan) {
        searchCondition.price = { $gt: priceGreaterThan };
      } else if (priceLessThan) {
        searchCondition.price = { $lt: priceLessThan };
      }
    }

    let getProduct = await productModel
      .find(searchCondition)
      .sort({ price: priceSort });

    //Validating if there any wrong value given by user
    if (getProduct.length == 0) {
      return res.status(404).send({ status: false, message: "No data found" });
    }
    res
      .status(200)
      .send({ status: true, message: "success", data: getProduct });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getProductsByProductId = async function (req, res) {
  try {
    let id = req.params.productId;

    //Validating productId given in Path params
    if (!isValidId(id)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid product id" });
    }
    let getProductById = await productModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!getProductById) {
      return res
        .status(400)
        .send({ status: false, message: "Product is deleted" });
    }
    res
      .status(200)
      .send({ status: true, message: "success", data: getProductById });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// =============================================UPDATE PRODUCT BY PRODUCT ID GIVEN IN PATH PARAM API==============================================================

const updateProduct = async function (req, res) {
  try {
    //Validating productId given in path params
    if (!isValidId(req.params.productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid productId" });
    }
    let id = req.params.productId;

    //Creating blank object to store data
    let update = {};
    //Creating blank object to update available size
    let size = {};
    //Storing files in an varible as per product model
    let productImage = req.files;

    //Validating request body
    if (!isValidValue(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please input valid request" });
    }

    //Parsing req. body into JSON
    requestBody = JSON.parse(JSON.stringify(req.body));

    //Destructuring
    let {
      title,
      description,
      price,
      currencyId,
      currencyFormat,
      isFreeShipping,
      style,
      availableSizes,
      installments,
    } = requestBody;

    //Validating title if given
    if (requestBody.hasOwnProperty("title")) {
      if (!isValidString(title) || !isValidTitle(title)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid title" });
      }
      update.title = title;
    }

    //Validating description if given
    if (requestBody.hasOwnProperty("description")) {
      if (!isValidString(description)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid description" });
      }
      update.description = description;
    }

    //Validating price if given
    if (requestBody.hasOwnProperty("price")) {
      if (!isValidprice(price)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid price" });
      }
      update.price = price;
    }

    //Validating currencyId if given
    if (requestBody.hasOwnProperty("currencyId")) {
      if (!["INR"].includes(currencyId)) {
        return res.status(400).send({
          status: false,
          message: "Enter valid currency abbreviation of Indian rupee ",
        });
      }
    }

    //Validating currencyFormat if given
    if (requestBody.hasOwnProperty("currencyFormat")) {
      if (!["₹"].includes(currencyFormat)) {
        return res.status(400).send({
          status: false,
          message: "Enter valid currency format of Indian rupee ",
        });
      }
    }

    if (productImage.length > 0) {
      let match = /\.(jpeg|png|jpg)$/.test(productImage[0].originalname);
      if (match == false) {
        return res.status(400).send({
          status: false,
          message: "Product image is required in jpeg|png|jpg format",
        });
      }
      let uploadedFileURL = await uploadFiles(productImage[0]);
      update.productImage = uploadedFileURL;
    }

    //Validating isFreeShipping if given
    if (requestBody.hasOwnProperty("isFreeShipping")) {
      if (!["true", "false"].includes(isFreeShipping)) {
        return res.status(400).send({
          status: false,
          message: "isFreeShipping should be a boolean value",
        });
      }
      update.isFreeShipping = isFreeShipping;
    }

    //Validating style if given
    if (requestBody.hasOwnProperty("style")) {
      if (!isValidString(style) || !isValidName(style)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid style" });
      }
      update.style = style;
    }

    //Validating availableSizes if given
    if (requestBody.hasOwnProperty("availableSizes")) {
      if (!isValidSize(availableSizes)) {
        return res
          .status(400)
          .send({ status: false, message: "Enter valid size as per Enum" });
      }
      availableSizes = availableSizes.split(",").map((x) => x.trim());
      size.availableSizes = { $each: availableSizes };
    }

    //Validating installments if given
    if (requestBody.hasOwnProperty("installments")) {
      if (/^[0-9]+$/.test(installments) == false) {
        return res.status(400).send({
          status: false,
          message: "Enter valid amount for installments",
        });
      }
      update.installments = installments;
    }

    //UPDATING PRODUCT DATA
    let updatedData = await productModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: update, $addToSet: size },
      { new: true }
    );

    if (!updatedData) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }

    res
      .status(200)
      .send({ status: true, message: "success", data: updatedData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ==============================================================DELETE PRODUCT API==============================================================

const deleteProduct = async function (req, res) {
  try {
    //Validating productId
    if (!isValidId(req.params.productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid productId" });
    }
    let id = req.params.productId;

    let product = await productModel.findById(id);
    if (!product) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }

    if (product.isDeleted == true) {
      return res
        .status(404)
        .send({ status: false, message: "This product is already deleted" });
    }

    let deletedData = await productModel.findOneAndUpdate(
      { _id: id },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

    res
      .status(200)
      .send({ status: true, message: "success", data: deletedData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductsByProductId,
  updateProduct,
  deleteProduct,
};
