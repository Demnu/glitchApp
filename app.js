const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const orders = require('./routes/orders');
const {spawn} = require('child_process');


require('dotenv').config();
const counter = require("./counter")
const port = 3000;
app.use('/api/v1/orders', orders);

app.get('/',(req,res)=>{
  res.send("Home")
})

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

start();
executeReadEmailScript();
setInterval(async() => {
  console.log("Executing Script at " + new Date())
  executeReadEmailScript();
}, 50000)



