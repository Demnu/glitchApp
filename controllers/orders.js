const connectDB = require('../db/connect');

const Order = require('../models/Order')
const getAllOrders = (async (req, res) => {
	Order.find({}, function (err, orders) {
    var ordersMap = [];

    orders.forEach(function(order) {
      ordersMap.push({id: order.orderID, customerName: order.customerName, date: order.date, products: order.products})
    });
    res.setHeader('Content-Range', orders.length)
    res.send(ordersMap);
  })

  // Order.find({},)
  // console.log("getting orders")
  // const orders = await Order.find({"products.1.name" : "HAYWIRE BLEND 1KG "})
  // // var ordersList = JSON.parse(orders);
  // res.
  // set('Access-Control-Allow-Origin', '*')
  // .json( orders )
})




// const createTask = asyncWrapper(async (req, res) => {
//   const task = await Task.create(req.body)
//   res.status(201).json({ task })
// })

// const getTask = asyncWrapper(async (req, res, next) => {
//   const { id: taskID } = req.params
//   const task = await Task.findOne({ _id: taskID })
//   if (!task) {
//     return next(createCustomError(`No task with id : ${taskID}`, 404))
//   }

//   res.status(200).json({ task })
// })
// const deleteTask = asyncWrapper(async (req, res, next) => {
//   const { id: taskID } = req.params
//   const task = await Task.findOneAndDelete({ _id: taskID })
//   if (!task) {
//     return next(createCustomError(`No task with id : ${taskID}`, 404))
//   }
//   res.status(200).json({ task })
// })
// const updateTask = asyncWrapper(async (req, res, next) => {
//   const { id: taskID } = req.params

//   const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
//     new: true,
//     runValidators: true,
//   })

//   if (!task) {
//     return next(createCustomError(`No task with id : ${taskID}`, 404))
//   }

//   res.status(200).json({ task })
// })

module.exports = {
  getAllOrders,

}
