const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");

router.get("/", (request, response, next) => {
    Order.find().exec().then(docs => {
        console.log(docs);
        response.status(200).json(
            docs
        )
    })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error
            });
        });

});


router.post("/", (request, response, next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId,
        quantity: request.body.quantity
    });
    order.save().then(result => {
        console.log(result);
        response.status(201).json({
            createOrderResponse: result
        });
    })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error
            });
        })

})

router.get("/:orderId", (request, response, next) => {
    response.status(200).json({
        message: "Orders details",
        orderId: request.params.productId,
    })
})



router.delete("/:orderId", (request, response, next) => {
    response.status(200).json({
        message: "Orders deleted",
        orderId: request.params.productId,
    })
})




module.exports = router;