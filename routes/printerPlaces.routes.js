const express = require('express')
const printerPlacesController = require('../controllers/printerPlaces.controllers')


const printerPlacesRouter = express.Router()

printerPlacesRouter.get('/selectPrinterPlace', printerPlacesController.selectPrinterPlace)
printerPlacesRouter.get('/selectPrinterHardware', printerPlacesController.selectPrinterHardware)
printerPlacesRouter.get('/selectPrinterHardwareGrouped', printerPlacesController.selectPrinterHardwareGrouped)
printerPlacesRouter.get('/selectPrinterConsumable', printerPlacesController.selectPrinterConsumable)
printerPlacesRouter.get('/selectPrinterConsumableGrouped', printerPlacesController.selectPrinterConsumableGrouped)
printerPlacesRouter.get('/selectPrinterConsumableMovement', printerPlacesController.selectPrinterConsumableMovement)
printerPlacesRouter.get('/selectPrinterHardwareMovement', printerPlacesController.selectPrinterHardwareMovement)

printerPlacesRouter.post('/RETURN_TO_STOCK_printerConsumable', printerPlacesController.RETURN_TO_STOCK_printerConsumable)
printerPlacesRouter.post('/updatePrinterPlace', printerPlacesController.updatePrinterPlace)
printerPlacesRouter.post('/insertMoveConsumable', printerPlacesController.insertMoveConsumable)
printerPlacesRouter.post('/insertPrinterPlaceUpdatePrinterHardware', printerPlacesController.insertPrinterPlaceUpdatePrinterHardware)
printerPlacesRouter.post('/makeMovePrinterConsumable', printerPlacesController.makeMovePrinterConsumable)


module.exports = printerPlacesRouter