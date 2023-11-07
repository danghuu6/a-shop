const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const db = require('./config/db')
const route = require('./route')

db.connect()

route(app)

app.listen(port, () => {
  console.log(`ShopX app listening on port ${port}`)
})