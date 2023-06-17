const connectToMongo = require('./db');
const express = require("express");
const app = express();
const port = 3000;


app.get('/', (req, res) => {
  res.send('This is a realtime chat application!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


connectToMongo();
