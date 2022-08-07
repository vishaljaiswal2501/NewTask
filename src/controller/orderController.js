const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const { isValidRequest, isValidId } = require("../validator/validation");

const createOrder = async function (req, res) {
  try {
    let userId = req.user._id;
    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please input valid request" });
    }
    let { cartId, cancellable } = req.body;

    let totalQuantity = 0;

    if (!cartId) {
      return res
        .status(400)
        .send({ status: false, message: "Cart id is required" });
    }

    if (!isValidId(cartId)) {
      return res
        .status(400)
        .send({ status: false, message: "CartId is not valid" });
    }

    if (cancellable != undefined) {
      let data = cancellable.toString();
      if (!["true", "false"].includes(data)) {
        return res.status(400).send({
          status: false,
          messsage: "Cancellable should be a boolean value",
        });
      }
    }

    let findCart = await cartModel
      .findOne({
        userId: userId,
        cartId: cartId,
        totalItems: { $gt: 0 },
      })
      .select({ _id: 0, __v: 0 });
    if (!findCart) {
      return res.status(404).send({
        status: false,
        message:
          " cart does not contains any product or cart is not for the user logged in",
      });
    }

    let order = JSON.parse(JSON.stringify(findCart));
    for (i = 0; i < order.items.length; i++) {
      totalQuantity += order.items[i].quantity;
    }
    order.totalQuantity = totalQuantity;
    order.cancellable = cancellable;

    let createdOrder = await orderModel.create(order);
    let obj = { userId: userId, totalItems: 0, totalPrice: 0, items: [] };
    await cartModel.findByIdAndUpdate(cartId, { $set: obj });
    return res
      .status(201)
      .send({ status: true, message: "Success", data: createdOrder });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const updateOrder = async function (req, res) {
  try {
    let userId = req.user._id;
    if (!isValidRequest(req.body)) {
      return res
        .status(400)
        .send({ status: false, message: "Please input valid request" });
    }
    let { orderId, status } = req.body;
    let arr = ["completed", "cancelled"];
    if (!orderId) {
      return res
        .status(400)
        .send({ status: false, message: "OrderId is required" });
    }
    if (!isValidId(orderId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter valid orderId" });
    }

    const findOrder = await orderModel.findById(orderId);
    if (!findOrder) {
      return res
        .status(404)
        .send({ status: false, message: "order not found" });
    }
    if (findOrder.userId.toString() != userId) {
      return res.status(400).send({
        status: false,
        message: `order  has not been created for the user ${userId}`,
      });
    }

    if (!status) {
      return res
        .status(400)
        .send({ status: false, message: "status is required" });
    }

    if (!arr.includes(status)) {
      return res
        .status(400)
        .send({ status: false, message: `status should only be ${arr}` });
    }

    if (status == arr[1]) {
      if (findOrder.cancellable.toString() == "false") {
        return res
          .status(400)
          .send({ status: false, mesage: "this order is not cancellable" });
      }
    }
    if (findOrder.status == arr[0]) {
      return res
        .status(400)
        .send({ status: false, message: "order has already been completed" });
    }

    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: status } },
      { new: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Success", data: updatedOrder });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createOrder, updateOrder };
