const express = require('express')
const printerHardwareController = require('../controllers/printerHardware.controllers')


const printerHardwareRouter = express.Router()

printerHardwareRouter.get('/selectPrinterHardware', printerHardwareController.selectPrinterHardware)

module.exports = printerHardwareRouter