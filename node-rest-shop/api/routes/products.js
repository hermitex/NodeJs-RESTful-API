const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")

const Product = require("../models/product")

router.get("/", (request, response, next) => {
    Product.find()
        .select("name price _id")
        .exec()
        .then(docs => {
            const productResponse = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:8080/products/" + doc._id
                        }
                    }
                })
            };
            // if (docs.length > 0) {
            response.status(200).json(productResponse)
            // } else {
            //     response.status(404).json({ response: "No Entries Found" })
            // }

        }).catch(error => {
            console.log(error);
            response.status(500).json({
                error
            })
        })
})


router.post("/", (request, response, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: request.body.name,
        price: request.body.price
    })
    product.save().then(result => {
        console.log(result)
        response.status(201).json({
            message: "Created product successfully",
            createProductResponse: {
                name: result.name,
                price: result.price,
                id: result._id,
                request: {
                    type: "GET",
                    url: "http://localhost:8080/products/" + result._id
                }
            }
        })
    })
        .catch(error => {
            console.log(error)
            response.status(500).json({
                error
            })
        });

})

router.get("/:productId", (request, response, next) => {
    const id = request.params.productId;
    Product.findById(id)
        .select("name price")
        .exec().then(doc => {
            console.log(doc);
            if (doc) {
                response.status(200).json({
                    productResponse: {
                        name: doc.name,
                        price: doc.price,
                        requests: {
                            type: "GET",
                            descript: "Get all products",
                            url: "http://localhost:8080/products/"
                        }
                    }
                });
            } else {
                response.status(500).json({
                    message: "Null entry found"
                });
            }


        })
        .catch(error => {
            console.log(error)
            response.status(200).json({ error });
        })
})


router.patch("/:productId", (request, response, next) => {
    const id = request.params.productId;
    const updateOps = {};
    for (const ops of request.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({
        _id: id

    }, { $set: updateOps })
        .select("name price")
        .exec()
        .then(result => {
            console.log(result)
            response.status(200).json({
                updatedProduct: {
                    message: "Product updated",
                    requests: {
                        type: "GET",
                        url: "http://localhost:8080/products/" + id
                    }
                }
            })

        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                error
            })

        })

})


router.delete("/:productId", (request, response, next) => {
    const id = request.params.productId;
    Product.remove({
        _id: id
    })
        .exec()
        .then(result => {
            response.status(200).json({
                message: "Product deleted",
                requests: {
                    type: "POST",
                    url: "http://localhost:8080/products",
                    data: {
                        name: "String",
                        price: "Number"
                    }
                }
            })
        })
        .catch(error => {
            console.log(error)
            response.status(500).json({
                error
            })
        })

})


module.exports = router;