const Order = require("../models/Order");

const getAllOrders = async (req, res) => {
  Order.find({}, function (err, orders) {
    var ordersMap = [];

    orders.forEach(function (order) {
      ordersMap.push({
        id: order.orderID,
        customerName: order.customerName,
        date: order.date,
        products: order.products,
        supplierName: order.supplierName,
      });
    });
    res.setHeader("Content-Range", orders.length);
    res.send(ordersMap);
  });
};
const getOrder = async (req, res, next) => {
  const { id: id } = req.params;
  const order = await Order.findOne({ orderID: id });
  if (order) {
    const orderStr = {
      id: order.orderID,
      customerName: order.customerName,
      date: order.date,
      products: order.products,
    };
    res.status(200).send({ orderStr });
  }
};

module.exports = {
  getAllOrders,
  getOrder,
};
