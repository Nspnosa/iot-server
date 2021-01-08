const express = require('express');
// const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

////database connection
// const client = new MongoClient(process.env.DB_CONNECT, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// client.connect((err) => {
//   const collection = client.db('test').collection('devices');
//   // perform actions on the collection object
//   // client.close();
// });

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log({ msg: 'could not connect to database' });
    } else {
      app.listen(process.env.PORT, () => {
        console.log({ msg: `Application running on port ${process.env.PORT}` });
      });
    }
  }
);
//run application

app.use(express.json());
app.use('/api', require('./routes/api'));
