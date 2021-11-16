const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const orders = require('./routes/orders');
const {spawn} = require('child_process');


require('dotenv').config();
const counter = require("./counter")
const port = 3000;
app.use('/api/v1/orders', orders);

const start = async () => {
  try {
    console.log("testing runner!!!!!!!")
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
  const python = spawn('python', ['readEmails.py']);
  console.log("Reading Emails")
  python.stdout.on('data', function (data) {
    dataToSend = data.toString();
   });
   python.on('close', (code) => {
    executeDeleteEmailsScript();
    });
}
const executeDeleteEmailsScript = ()=>{
  const python = spawn('python', ['deleteEmails.py']);
  console.log("Deleting Emails")
  python.stdout.on('data', function (data) {
    dataToSend = data.toString();
   });
   python.on('close', (code) => {
      counter.output();
      
    });
}

start();
executeReadEmailScript();
setInterval(async() => {
  executeReadEmailScript();
}, 10000000)



