const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser")
const mongoose = require("mongoose");



const productsRoutes = require("./node-rest-shop/api/routes/products");
const ordersRoutes = require("./node-rest-shop/api/routes/orders");

mongoose.connect("mongodb+srv://hermitex:" + process.env.MONGO_ATLAS_PW + "@cluster0-b3zu7.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.Promise = global.Promise;

// Middleware
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (request.method === "OPTIONS") {
        response.header("Access-Control-Allow-Methos", "PUT, POST, PATCH, DELETE, GET");
        return response.status(200).json({});
    }
    next();
})

app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);

app.use((request, response, next) => {
    const error = new Error("Not Found");
    error.status(404);
    next(error);
})

app.use((error, request, response, next) => {
    response.status(error.status || 500);
    response.json({
        error: {
            message: error.message
        }
    })
})


module.exports = app;