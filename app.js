const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const orders = require('./routes/orders');
const recipes = require('./routes/recipes');
const {spawn} = require('child_process');
const path = require('path');


require('dotenv').config();
const counter = require("./counter")
const port = 3000;
app.use(function(req, res, next) {
  res.header("Access-Control-Expose-Headers", "X-Total-Count, Content-Range");
  res.header("Access-Control-Allow-Origin", "*"),
  res.header("Access-Control-Allow-Credentials", "true"),
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT"),
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next();
});
app.use('/api/v1/orders', orders);
app.use('/api/v1/recipes', recipes);

app.use(express.static(path.join("app", 'build')));


app.get('/', function (req, res) {
  res.sendFile(path.join('/app/build', 'index.html'));
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
}, 50000)



