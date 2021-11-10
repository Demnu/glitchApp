const util = require('util');
const fs = require('fs')
const LineByLineReader = require('line-by-line')
const connectDB = require('./db/connect');
const Order = require('./models/Order')
const Product = require('./models/Product')
var productNames = [];
var products =[];
var data = [];
var orders = [];

const blends = [
    {       
        name:"Lord's Blend",amount:1000
    },
    {       
        name:"Custom Blend",amount:1000
    },
    {       
        name:"Custom Blend 1KG",amount:1000
    },
    {       
        name:"Roast Your Own Blend 1kg",amount:1000
    },
    {       
        name:"SWEET KICKS BLEND 1KG",amount:1000
    },
    {       
        name:"HAYWIRE BLEND 1KG",amount:1000
    },
    {       
        name:"RETAIL CUSTOM BLEND 250G",amount:250
    },
    {       
        name:"BROASTERS BLEND 1KG",amount:1000
    },
    {       
        name:"RETAIL HAYWIRE BLEND 1KG",amount:1000
    },
    {       
        name:"RETAIL SWEET KICKS BLEND 1KG",amount:1000
    },
    {       
        name:"RETAIL SWEET KICKS BLEND 250G",amount:250
    },
    {       
        name:"RETAIL HAYWIRE BLEND 250G",amount:250
    },
    {       
        name:"Roast Your Own Blend_ROASTED 1kg",amount:1000
    },
    {       
        name:"SHERWOOD HOUSE BLEND 1KG TIN",amount:1000
    },
    {       
        name:"SHERWOOD PINES BLEND 1KG TIN",amount:1000
    },

    {       
        name:"RETAIL BROASTERS BLEND 250G",amount:250
    },

    {       
        name:"RETAIL BROASTERS BLEND 1KG",amount:1000
    },

    {       
        name:"SHERWOOD PINES BLEND RETAIL 1KG BAG",amount:1000
    },

    {       
        name:"SHERWOOD HOUSE BLEND RETAIL 1KG BAG",amount:1000
    },
    {       
        name:"SHERWOOD PINES BLEND RETAIL 250G BAG",amount:250
    },

    {       
        name:"SHERWOOD HOUSE BLEND RETAIL 500G BAG",amount:500
    },
    {       
        name:"SHERWOOD PINES BLEND RETAIL 500G BAG",amount:500
    },
    {
        name:"DECAF Ground 1KG",amount:1000
    }
]

var counter = 0;
const output = async()=>{
    console.log("logging into db");
    await connectDB(process.env.MONGO_URI);
    console.log()
    //get all products
    productNames = [];
    try{
        products = await Product.find({})
    }catch(err){
        console.log(err);
    }
    console.log(products)
    for (var i = 0; i<products.length; i++){
        productNames.push(products[i].name);
    }


    // lr = new LineByLineReader('C:/Users/harry/AppData/Roaming/Thunderbird/Profiles/1ogmaobo.default-release/ImapMail/imap.gmail.com/INBOX','utf8');
    lr = new LineByLineReader('./INBOXtest','utf8');
    
    lr.on('error', function (err) {
        // 'err' contains error object
    });
    
    lr.on('line', function (line) {
        // 'line' contains the current line without the trailing newline character.
        data.push(line);
    });
    
    lr.on('end', function () {
        findOrders();
        // All lines are read, file is closed now.
    });

}
function findOrders(){
    for (var i = 0 ; i<data.length;i++){
        var foundOrder =false;
        var str = data[i];
        if (str.includes('Date:'))// 00 - Date: Mon, 08 Nov 2021 03:07:42 +0000
        {
            var str2 = String(data[i+16]);// 16 - Phone: 0478 126 069 ABN: 41618895953          Order #G5515   Order date 08
            if(str2.includes('Phone:')&& str2.includes('Order')){
                //if order is 16 lines after
                foundOrder = true;
                i=i+16;
            }
            else{
                //if order is 17 lines after
                var str2 = String(data[i+17]);// 17 - Phone: 0478 126 069 ABN: 41618895953          Order #G5515   Order date 08
                if(str2.includes('Phone:')&& str2.includes('Order')){
                    //if order is 16 lines after
                    foundOrder = true;
                    i=i+17;
                }
            }
            if(foundOrder){
                const order = {orderID:"",date:"",products:[]};
                var lineArray = str2.split(" ");
                //get order id
                const orderID = (element) => element.match("Order");
                const arrayNumberForOrderID = lineArray.findIndex(orderID)+1
                order.orderID = lineArray[arrayNumberForOrderID]

                //get order day
                const orderDay = (element) => element.match("date");
                const arrayNumberForOrderDay = lineArray.findIndex(orderDay)+1
                var day = lineArray[arrayNumberForOrderDay]

                //get order month
                i++;
                var str3 = String(data[i])

                // Get date
                var lineArray = str3.split(" ");
                var month = lineArray[0];
                var year = lineArray[1];
                var date = new Date(Date.parse(`${day} ${month} ${year} 00:00:00 GMT`));

                order.date = date;

                //get products
                var products = [];
                var productsStr = String();
                while(!productsStr.includes("Subtotal")){
                    productsStr +=(data[i]+" ")
                    i++;
                }

                //go through each product of order
                var lineArray = productsStr.split(" ");

                const price = (element) => element.match("Price");
                const arrayNumberForPrice = lineArray.findIndex(price);
                //find first product
                var k = arrayNumberForPrice+1;

                while(lineArray[k]===""){
                    k++;
                }

                var productName = String();
                var str4 = String(lineArray[k]);
                while(!str4.includes("SKU")){
                    productName += (lineArray[k]+" ");
                    k++;
                    str4 = String(lineArray[k]);
                }
                console.log(productName);
                //search string for products given in "Blends"                
                // for(var k = 0; k<blends.length; k++){
                //     if(productsStr.includes(blends[k].name)){
                //         products.push(blends[k]);
                //     }
                // }
                

                order.products = products;
                orders.push(order);

            }
    
        }
    }
    if(orders.length === 0){
        console.log("empty inbox")
    }

    // for(var i = 0 ; i<orders.length ; i++){
    //     createOrder(orders[i]);
    // }


}

const createOrder = async (order) => {
        try{
            const task = await Order.create(order);
            console.log(`Order ${order} saved`)

        }catch(err){
            console.error(err)
        }
    
  }
const createProduct = async (product) => {
try{
    const task = await Product.create(product);
    console.log(`Product ${product} saved`)

}catch(err){
    console.error(err)
    }
}
const getAllProducts = async (product) => {
    try{
        const tasks = await Product.find({})
        console.log(`Product ${product} saved`)

    }catch(err){
        console.error(err)
    }
}


exports.output = output;
