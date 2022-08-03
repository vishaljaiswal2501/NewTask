const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

const { isValidRequest, isValidId } = require("../validator/validation");

const createCart = async function (req, res) {
  try {
    let userId = req.user._id;
    if (!isValidRequest(req.body)) {
      return res.status(400).send({ status: false, message: err.message });
    }
    let { cartId, productId, quantity } = req.body;
    let data = { totalPrice: 0, totalItems: 1, items: [] };

    if (!productId) {
      return res
        .status(400)
        .send({ status: false, message: "productId is required" });
    }
    if (!isValidId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Provide valid Id" });
    }
    if (quantity == undefined) {
      return res
        .status(400)
        .send({ status: false, message: "Quantity is required" });
    }
    if (!/^[1-9]+[0]*$/.test(quantity)) {
      return res.status(400).send({
        status: false,
        message: "Quantity should be greater then zero",
      });
    }
    let findProduct = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!findProduct) {
      return res
        .status(404)
        .send({ status: false, message: "Product not found" });
    }
    let findCart = await cartModel.findOne({ userId: userId });
    if (!findCart) {
      data.userId = userId;
      data.items.push({ productId: productId, quantity: quantity });

      data.totalPrice = quantity * findProduct.price;
      data.totalItems = 1;

      const createdCart = await cartModel.create(data);
      const finalCart = await cartModel.findOne(createdCart).populate({
        path: "items.productId",
        select: {
          _id: 1,
          title: 1,
          price: 1,
          productImage: 1,
          description: 1,
        },
      });
      return res
        .status(201)
        .send({ status: true, message: "Success", data: finalCart });
    }
    if (cartId) {
      if (!isValidId(cartId)) {
        return res
          .status(400)
          .send({ status: false, message: "Provide valid cartId" });
      } else if (findCart._id.toString() != cartId) {
        return res.status(400).send({
          status: false,
          message: "cart is not for the user who is requseting",
        });
      }
    }
    let flag = 0;
    for (i = 0; i < findCart.items.length; i++) {
      if (findCart.items[i].productId == productId) {
        findCart.items[i].quantity += quantity;
        flag = 1;
      }
    }
    if (flag == 0) {
      findCart.items.push({ productId: productId, quantity: quantity });
      findCart.totalItems += 1;
    }
    findCart.totalPrice += quantity * findProduct.price;
    const addProductToexistingCart = await cartModel
      .findOneAndUpdate({ userId: userId }, { $set: findCart }, { new: true })
      .populate({
        path: "items.productId",
        select: {
          _id: 1,
          title: 1,
          price: 1,
          productImage: 1,
          description: 1,
        },
      });

    return res.status(200).send({
      status: true,
      message: "Success",
      data: addProductToexistingCart,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const updateCart = async function (req, res) {
  try {
    let userId = req.user._id;
    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Input valid request" });
    }
    let { cartId, productId, removeProduct } = req.body;
    if (!cartId) {
      return res
        .status(400)
        .send({ status: false, message: "cartId is required" });
    }
    if (!isValidId(cartId)) {
      return res
        .status(400)
        .send({ status: false, message: "Provide valid cartId" });
    }
    if (!productId) {
      return res
        .status(400)
        .send({ status: false, message: "ProductId is required" });
    }
    if (!isValidId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: "Provide valid productId" });
    }
    if (removeProduct == undefined) {
      return res.status(400).send({
        status: false,
        message:
          "RemoveProduct is required to decrease or to delete the product",
      });
    }

    if (![0, 1].includes(removeProduct)) {
      return res.status(400).send({
        status: false,
        message:
          "remove product should contain only 0 for deleting the product and 1 for decreasing the quantity of product by one",
      });
    }

    const findCart = await cartModel.findOne({
      _id: cartId,
      totalItems: { $gt: 0 },
    });
    if (!findCart) {
      return res
        .status(404)
        .send({ status: false, message: "No product exist in this cart" });
    }
    if (findCart.userId.toString() != userId) {
      return res.status(400).send({
        status: false,
        message: "This cart is not for the user who is logged in",
      });
    }
    let flag = 0;
    let findProduct = await productModel.findById(productId);

    for (i = 0; i < findCart.items.length; i++) {
      if (findCart.items[i].productId == productId) {
        flag = 1;
        if (removeProduct == 0) {
          findCart.totalPrice -= findCart.items[i].quantity * findProduct.price;
          findCart.totalItems -= 1;
          findCart.items.splice(i, 1);
        } else if (removeProduct == 1) {
          findCart.totalPrice -= findProduct.price;
          findCart.items[i].quantity--;
          if (findCart.items[i].quantity == 0) {
            findCart.totalItems -= 1;
            findCart.items.splice(i, 1);
          }
        }
      }
    }
    if (flag == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Product does not exist in the cart" });
    }
    const updatedCart = await cartModel
      .findOneAndUpdate({ _id: cartId }, { $set: findCart }, { new: true })
      .populate({
        path: "items.productId",
        select: {
          _id: 1,
          title: 1,
          price: 1,
          productImage: 1,
          description: 1,
        },
      });
    return res
      .status(200)
      .send({ status: false, message: "Success", data: updatedCart });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getCart = async function (req, res) {
  try {
    let userId = req.user._id;
    const findCart = await cartModel
      .findOne({
        userId: userId,
        totalItems: { $gt: 0 },
      })
      .populate({
        path: "items.productId",
        select: {
          _id: 1,
          title: 1,
          price: 1,
          productImage: 1,
          description: 1,
        },
      });
    if (!findCart) {
      return res
        .status(404)
        .send({ status: false, message: "No product found in Cart" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: findCart });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const deleteCart = async function (req, res) {
  try {
    let userId = req.user._id;
    let obj = { userId: userId, totalItems: 0, totalPrice: 0, items: [] };
    const deletedCart = await cartModel.findOneAndUpdate(
      { userId: userId, totalItems: { $gt: 0 } },
      { $set: obj },
      { new: true }
    );
    if (!deletedCart) {
      return res.status(404).send({
        status: false,
        message: "No cart found for this user or no product exist in this cart",
      });
    }
    return res.status(204).send();
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createCart, updateCart, getCart, deleteCart };
