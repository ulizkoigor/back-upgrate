const express = require('express')
const printerHardwareController = require('../controllers/printerHardware.controllers')


const printerHardwareRouter = express.Router()

printerHardwareRouter.get('/selectPrinterHardware', printerHardwareController.selectPrinterHardware)

printerHardwareRouter.get('/selectPrinterPlace', printerHardwareController.selectPrinterPlace)
printerHardwareRouter.get('/selectPrinterHardwareGrouped', printerHardwareController.selectPrinterHardwareGrouped)
printerHardwareRouter.get('/selectPrinterConsumable', printerHardwareController.selectPrinterConsumable)
printerHardwareRouter.get('/selectPrinterConsumableGrouped', printerHardwareController.selectPrinterConsumableGrouped)
printerHardwareRouter.get('/selectPrinterConsumableMovement', printerHardwareController.selectPrinterConsumableMovement)
printerHardwareRouter.get('/selectPrinterHardwareMovement', printerHardwareController.selectPrinterHardwareMovement)

printerHardwareRouter.post('/RETURN_TO_STOCK_printerConsumable', printerHardwareController.RETURN_TO_STOCK_printerConsumable)
printerHardwareRouter.post('/updatePrinterPlace', printerHardwareController.updatePrinterPlace)
printerHardwareRouter.post('/insertMoveConsumable', printerHardwareController.insertMoveConsumable)
printerHardwareRouter.post('/insertPrinterPlaceUpdatePrinterHardware', printerHardwareController.insertPrinterPlaceUpdatePrinterHardware)
printerHardwareRouter.post('/makeMovePrinterConsumable', printerHardwareController.makeMovePrinterConsumable)


module.exports = printerHardwareRouter