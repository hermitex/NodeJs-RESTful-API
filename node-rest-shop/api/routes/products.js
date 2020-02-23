const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")

const Product = require("../models/product")

router.get("/", (request, response, next) => {
    Product.find().exec().then(docs => {
        console.log(docs)
        if (docs.length > 0) {
            response.status(200).json(docs)
        } else {
            response.status(404).json({ response: "No Entries Found" })
        }

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
            message: "Handling POST requests to /products",
            createProductResponse: result
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
    Product.findById(id).exec().then(doc => {
        console.log(doc);
        if (doc) {
            response.status(200).json(doc);
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
    Product.update({
        _id: id,

    }, { $set: { updateOps } })
        .exec()
        .then(result => {
            response.status(200).json({
                message: result,
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
            response.status(200).json(result)
        })
        .catch(error => {
            console.log(error)
            response.status(500).json({
                error
            })
        })

})


module.exports = router;