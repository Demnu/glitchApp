const express = require('express');
const app = express();
const connectDB = require('./db/connect');
require('dotenv').config();
const counter = require("./counter")
const port = 3000;





const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
    counter.output();
    setInterval(() => {
        counter.output();
    }, 100000)

  } catch (error) {
    console.log(error);
  }
};



start();
