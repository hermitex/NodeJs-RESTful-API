const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");

router.get("/", (request, response, next) => {
    Order.find().exec().then(docs => {
        if (docs.length > 0) {
            console.log(docs);
            response.status(200).json(
                docs
            )
        } else {
            response.status(404).json({
                message: "No entries found"
            })
        }

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
    const id = request.params.orderId;
    Order.findById(id).exec().then(doc => {
        if (doc) {
            console.log(doc);
            response.status(200).json({
                order: doc
            })
        } else {
            response.status(404).json({
                message: "No entries",
            })
        }

    }).catch(error => {
        console.log(error)
        response.status(500).json({
            error
        })
    })

})



router.delete("/:orderId", (request, response, next) => {
    const id = request.params.orderId;

    Order.remove({ _id: id }).exec().then(doc => {

        console.log(doc)
        response.status(200).json({
            message: "Orders deleted",
            orderId: id,
        })

        response.status(404).json({
            message: "No entries found"
        })

    }).catch(error => {
        response.status(500).json({
            error
        })
    })

})




module.exports = router;