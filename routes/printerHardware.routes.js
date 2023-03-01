const express = require('express')
const printerHardwareController = require('../controllers/printerHardware.controllers')


const printerHardwareRouter = express.Router()

printerHardwareRouter.get('/selectPrinterHardware', printerHardwareController.selectPrinterHardware)
printerHardwareRouter.get('/selectMovementPrinterHardware', printerHardwareController.selectMovementPrinterHardware)
printerHardwareRouter.get('/leftJoinPrinterHardwareAndPrinterPlace', printerHardwareController.leftJoinPrinterHardwareAndPrinterPlace)

module.exports = printerHardwareRouter