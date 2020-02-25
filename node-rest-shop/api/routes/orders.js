const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product")

router.get("/", (request, response, next) => {
    Order.find()
        .select("product quantity _id")
        .populate("product")
        .exec()
        .then(docs => {
            if (docs.length > 0) {
                console.log(docs);
                response.status(200).json({
                    count: docs.length,
                    orders: docs.map(doc => {
                        return {
                            _id: doc._id,
                            product: doc.product,
                            quantity: doc.quantity,
                            requests: {
                                type: "GET",
                                url: "http://localhost:8080/orders/" + doc._id
                            }
                        }
                    })

                })
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
    Product.findById(request.body.productId)
        .then(product => {
            if (!product) {
                return response.status(404).json({
                    message: "Product not found"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: request.body.quantity,
                product: request.body.productId
            });
            return order.save()
        })
        .then(result => {
            console.log(result);
            response.status(201).json({
                message: "Order stored",
                createOrderResponse: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                requests: {
                    type: "GET",
                    url: "http://localhost:8080/orders/" + result._id
                }
            });
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error
            });
        });
});

router.get("/:orderId", (request, response, next) => {
    const id = request.params.orderId;
    Order.findById(id)
        .select("quantity product _id ")
        .exec()
        .then(doc => {
            if (doc) {
                console.log(doc);
                response.status(200).json({
                    order: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:8080/orders"
                    }
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

    Order.remove({ _id: request.params.orderId })
        .exec()
        .populate("product")
        .then(doc => {
            console.log(doc)
            response.status(200).json({
                message: "Order deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:8080/orders",
                    body: {
                        productId: "ID", quantity: "Number"
                    }
                }
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