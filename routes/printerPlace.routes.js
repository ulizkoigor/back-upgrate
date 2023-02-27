const express = require('express')
const printerPlaceController = require('../controllers/printerPlace.controllers')


const printerPlaceRouter = express.Router()

printerPlaceRouter.get('/selectPrinterPlace', printerPlaceController.selectPrinterPlace)

module.exports = printerPlaceRouter