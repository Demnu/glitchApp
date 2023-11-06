const Order = require("../models/Order");

const getAllOrders = async (req, res) => {
  try {

    let orders = await Order.find({})
    .sort({ date: -1, supplierName: 1, orderID: 1 })
    .limit(300);
    // Map the orders to the desired structure
    let ordersMap = orders.map(order => ({
      id: order.orderID,
      customerName: order.customerName,
      date: order.date,
      products: order.products,
      supplierName: order.supplierName
    }));

    res.setHeader("Content-Range", `orders ${orders.length}`);
    res.send(ordersMap)
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).send("Internal Server Error");
  }
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
