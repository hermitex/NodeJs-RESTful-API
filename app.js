const express = require("express");
const app = express();

const productsRoutes = require("./node-rest-shop/api/routes/products");

const ordersRoutes = require("./node-rest-shop/api/routes/orders");

app.use("/products", productsRoutes);

app.use("/orders", ordersRoutes);

module.exports = app;