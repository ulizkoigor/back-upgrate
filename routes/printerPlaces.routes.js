const express = require('express')
const printerPlacesController = require('../controllers/printerPlaces.controllers')


const printerPlacesRouter = express.Router()

printerPlacesRouter.get('/loadFromDB', printerPlacesController.loadFromDB)
printerPlacesRouter.get('/loadPrinterHardwareFromDB', printerPlacesController.loadPrinterHardwareFromDB)
printerPlacesRouter.get('/loadPrinterHardwareFromDBGrouped', printerPlacesController.loadPrinterHardwareFromDBGrouped)
printerPlacesRouter.get('/loadPrinterConsumableFromDB', printerPlacesController.loadPrinterConsumableFromDB)
printerPlacesRouter.get('/loadPrinterConsumableFromDBGrouped', printerPlacesController.loadPrinterConsumableFromDBGrouped)
printerPlacesRouter.post('/insertMoveConsumable', printerPlacesController.insertMoveConsumable)
printerPlacesRouter.get('/printerConsumableMovement_SELECT', printerPlacesController.printerConsumableMovement_SELECT)
printerPlacesRouter.post('/RETURN_TO_STOCK_printerConsumable', printerPlacesController.RETURN_TO_STOCK_printerConsumable)

module.exports = printerPlacesRouter