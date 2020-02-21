const express = require("express");
const router = express.Router();

router.get("/", (request, response, next) => {
    response.status(200).json({
        message: "Orders were fetched"
    })
})


router.post("/", (request, response, next) => {
    const order = {
        productId: request.body.productId,
        quantity: request.body.quantity
    }
    response.status(201).json({
        message: "Orders were created",
        order: order
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