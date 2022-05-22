const util = require("util");
const fs = require("fs");
const LineByLineReader = require("line-by-line");
const connectDB = require("./db/connect");
const Order = require("./models/Order");
const Product = require("./models/Product");
const { toNamespacedPath } = require("path");

var counter = 0;
const output = async () => {
  findOrders();
  // console.log("logging into db");
  // await connectDB(process.env.MONGO_URI);
  // console.log("logged in")
  //get all products
};

function readOutputTxt() {
  var data = [];
  // lr = new LineByLineReader('C:/Users/harry/AppData/Roaming/Thunderbird/Profiles/1ogmaobo.default-release/ImapMail/imap.gmail.com/INBOX','utf8');
  // lr = new LineByLineReader('./INBOXtest','utf8');
  lr = new LineByLineReader("orders.txt", "utf8");

  lr.on("error", function (err) {
    // 'err' contains error object
  });

  lr.on("line", function (line) {
    // 'line' contains the current line without the trailing newline character.
    data.push(line);
  });

  lr.on("end", function () {});
  return data;
}

async function findOrders() {
  var productNames = [];
  var productsMongo = [];
  var data = [];
  data = readOutputTxt();
  var orders = [];
  productNames = [];
  try {
    productsMongo = await Product.find({});
  } catch (err) {
    console.log(err);
  }
  try {
    ordersMongo = await Order.find({});
  } catch (err) {
    console.log(err);
  }

  for (var i = 0; i < data.length; i++) {
    var foundOrder = false;
    var str = data[i];
    //find new order
    //Confirmation          To  *The Long Room Cafe Dungog*  Customer ID:10
    if (
      str.includes("Customer ID") ||
      (str.includes("Confirmation") && str.includes("Customer"))
    ) {
      console.log(str);
      const order = {
        orderID: "",
        date: "",
        products: [],
        customerID: "",
        customerName: "",
      };
      //split string into array
      var strArrayNameCustomerID = str.split(" ");

      //get customer name
      const findTo = (element) => element.match("To");
      const arrayNumberForStartOfCustomerID =
        strArrayNameCustomerID.findIndex(findTo) + 2;
      var customerNameStr = String();
      var hasTwoAsterisks = false;
      var whileCounterForFindingCustomerID = 0;
      while (!hasTwoAsterisks) {
        customerNameStr +=
          strArrayNameCustomerID[
            arrayNumberForStartOfCustomerID + whileCounterForFindingCustomerID
          ] + " ";
        var asteriskCounter = 0;
        if (customerNameStr) {
          for (var j = 0; j < customerNameStr.length; j++) {
            if (customerNameStr.charAt(j) == "*") {
              asteriskCounter++;
            }
            if (asteriskCounter === 2) {
              hasTwoAsterisks = true;
            }
          }
        } else {
          console.error("ERROR! could not find 2 asterisks in " + str);
          i = i++;
          whileCounterForFindingCustomerID = 100;
        }
        whileCounterForFindingCustomerID++;
      }
      //remove asterisks
      const removeAsterisksandSpace = (customerNameStr) => {
        let forbiddenChar = "*";
        customerNameStr = customerNameStr.split(forbiddenChar).join("");
        return customerNameStr.slice(0, -1);
      };
      order.customerName = removeAsterisksandSpace(customerNameStr);

      //get customer ID
      for (var k = 0; k < strArrayNameCustomerID.length; k++) {
        var temp = String(strArrayNameCustomerID[k]);
        if (temp.includes("ID")) {
          order.customerID = temp.slice(3);
        }
      }

      //get order date
      //find string - Phone: 0478 126 069 ABN: 41618895953          Order #G5521   Order date 11
      for (var k = i; k < data.length; k++) {
        if (data[k].includes("ABN: ")) {
          i = k;
          break;
        }
      }
      var strArrayOrderDayID = data[i].split(" ");

      //find day
      const findDate = (element) => element.match("date");
      const arrayNumberForOrderDay = strArrayOrderDayID.findIndex(findDate) + 1;
      const day = Number(strArrayOrderDayID[arrayNumberForOrderDay]);

      //get orderID
      var orderID = String();
      for (var k = 0; k < strArrayOrderDayID.length; k++) {
        if (strArrayOrderDayID[k].includes("#")) {
          orderID = strArrayOrderDayID[k];
        }
      }
      const removeHashtag = (orderID) => {
        let forbiddenChar = "#";
        orderID = orderID.split(forbiddenChar).join("");
        return orderID;
      };
      order.orderID = removeHashtag(orderID);

      for (var k = i; k < data.length; k++) {
        // Nov 2021   Delivery Date  18 Nov 2021              Item Qty Price
        if (data[k].includes("Item Qty Price")) {
          i = k;
          break;
        }
      }
      var strArrayOrderMonthYearItem = data[i].split(" ");

      //get month
      const month = strArrayOrderMonthYearItem[0];

      //get year
      const year = strArrayOrderMonthYearItem[1];

      order.date = new Date(`${day} ${month} ${year}`);
      // if date is invalid change date to current date
      if (order.date instanceof Date && isNaN(order.date)) {
        order.date = new Date();
      }
      //get products ordered
      var productsStr = String();
      while (!productsStr.includes("Subtotal")) {
        productsStr += data[i] + " ";
        i++;
      }
      const strArrayOrders = productsStr.split(" ");

      //count how many different products
      var amountOfDifferentProducts = 0;
      for (var k = 0; k < strArrayOrders.length; k++) {
        if (strArrayOrders[k].includes("SKU")) {
          amountOfDifferentProducts++;
        }
      }

      order.products = amountOfDifferentProducts;
      var ordersStrArray = [];
      //remove whitespace DO THIS EVENTUALLY FOR EVERY SEARCH
      for (var k = 0; k < strArrayOrders.length; k++) {
        if (strArrayOrders[k] != "") {
          ordersStrArray.push(strArrayOrders[k]);
        }
      }
      const findPrice = (element) => element.match("Price");
      const arrayNumberForPrice = ordersStrArray.findIndex(findPrice);

      //split products into seperate arrays
      var productStrings = [];
      var productString = "";
      for (var k = arrayNumberForPrice + 1; k < ordersStrArray.length; k++) {
        if (ordersStrArray[k].includes("SKU")) {
          var orderFinished = false;
          while (!orderFinished) {
            if (isNaN(ordersStrArray[k])) {
              productString += ordersStrArray[k] + " ";
              k++;
            } else {
              productString += ordersStrArray[k] + " ";
              productString += ordersStrArray[k + 1];
              productStrings.push(productString);
              productString = "";
              k++;
              orderFinished = true;
            }
          }
        } else {
          productString += ordersStrArray[k] + " ";
        }
      }
      //retrieve product name and amount

      var products = [];
      for (var k = 0; k < productStrings.length; k++) {
        var product = { id: "", amount: "" };
        const productStringArray = productStrings[k].split(" ");
        var nameRead = false;
        var id = "";
        var index = 0;
        while (!nameRead) {
          var readString = productStringArray[index];
          if (readString.includes("SKU")) {
            nameRead = true;
            index++;
            break;
          } else {
            id += productStringArray[index] + " ";
            index++;
          }
        }
        product.id = id.slice(0, -1);
        product.amount = productStringArray[productStringArray.length - 2];
        products.push(product);
      }

      //save products
      for (var g = 0; g < products.length; g++) {
        var duplicate = false;
        for (var j = 0; j < productsMongo.length; j++) {
          // console.log(`Testinh ID:  mongo:${ordersMongo[j].orderID} and email: ${orders[i].orderID}`)
          if (productsMongo[j].id == products[g].id) {
            duplicate = true;
            // console.log(`Duplicate ID: ${ordersMongo[j].orderID}`)
          }
        }
        if (!duplicate) {
          createProduct(products[g]);
        }
      }
      order.products = products;
      orders.push(order);
    }
  }
  if (orders.length === 0) {
    console.log("empty inbox");
  }

  for (var i = 0; i < orders.length; i++) {
    var duplicate = false;
    console.log(orders[i].orderID);
    for (var j = 0; j < ordersMongo.length; j++) {
      // console.log(`Testinh ID:  mongo:${ordersMongo[j].orderID} and email: ${orders[i].orderID}`)
      if (ordersMongo[j].orderID == orders[i].orderID) {
        duplicate = true;
        // console.log(`Duplicate ID: ${ordersMongo[j].orderID}`)
      }
    }
    if (!duplicate) {
      createOrder(orders[i]);
    }
  }
  //delete text file
  fs.truncate("orders.txt", 0, function () {
    console.log("deleting output.txt");
  });
  data = [];
  console.log("finished reading and saving");
}

const createOrder = async (order) => {
  try {
    const task = await Order.create(order);
    console.log(`Order ${order} saved`);
  } catch (err) {
    console.error(err);
  }
};
const createProduct = async (product) => {
  try {
    const task = await Product.create(product);
    console.log(`Product ${product.name} saved`);
  } catch (err) {
    console.error(err);
  }
};
const getAllProducts = async (product) => {
  try {
    const tasks = await Product.find({});
    console.log(`Product ${product} saved`);
  } catch (err) {
    console.error(err);
  }
};

exports.output = output;
