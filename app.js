const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const orders = require('./routes/orders');
const recipes = require('./routes/recipes');
const products = require('./routes/products');
const roasting = require('./routes/roasting');
const auth = require('./routes/auth');
const test = require('./routes/test');
const {spawn} = require('child_process');
const path = require('path');
const cors = require("cors");

const jwt = require('jsonwebtoken')

require('dotenv').config();
const counter = require("./counter")
const port = 3000;
app.use(function(req, res, next) {
  res.header("Access-Control-Expose-Headers", "X-Total-Count, Content-Range");
  res.header("Access-Control-Allow-Origin", "*"),
  res.header("Access-Control-Allow-Credentials", "true"),
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH"),
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next();
});
app.use(express.json());

app.use('/api/v1/orders', orders);
app.use('/api/v1/recipes', recipes);
app.use('/api/v1/products', products);
app.use('/api/v1/roasting', roasting);
// app.use('/api/v1/auth', auth);
// app.use('/api/v1/test', test);

app.use(express.static(path.join(__dirname,'build')));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const start = async () => {
  try {

    console.log("logging into db");
    await connectDB(process.env.MONGO_URI);
    // counter.output();
    console.log("logged in")
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)      
    );

  } catch (error) {
    console.log(error);
  }
};
const executeReadEmailScript = ()=>{
  const python = spawn(process.env.PYTHON_CMD, ['readEmails.py']);
  python.stdout.on('data', function (data) {
    dataToSend = data.toString();
   });
   python.on('close', (code) => {
     console.log(dataToSend);
    executeDeleteEmailsScript();
    });
}
const executeDeleteEmailsScript = ()=>{
  const python = spawn(process.env.PYTHON_CMD, ['deleteEmails.py']);
  python.stdout.on('data', function (data) {
    dataToSend = data.toString();
   });
   python.on('close', (code) => {
     console.log(dataToSend)
      counter.output();
    });
}
console.log(__dirname+"/client/app/index.js")

start();

executeReadEmailScript();
setInterval(async() => {
  console.log("Executing Script at " + new Date())
  executeReadEmailScript();
}, 1000000)



