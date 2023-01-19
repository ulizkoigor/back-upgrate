const express = require('express')
const placeController = require('../controllers/place.controllers')


const placeRouter = express.Router()

placeRouter.get('/getPlaceOfPrinterList', placeController.getPlaceOfPrinterList)
placeRouter.get('/getStockList', placeController.getStockList)

module.exports = placeRouter