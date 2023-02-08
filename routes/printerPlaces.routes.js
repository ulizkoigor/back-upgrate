const express = require('express')
const printerPlacesController = require('../controllers/printerPlaces.controllers')


const printerPlacesRouter = express.Router()

printerPlacesRouter.get('/loadFromDB', printerPlacesController.loadFromDB)
printerPlacesRouter.get('/loadPrinterHardwareFromDB', printerPlacesController.loadPrinterHardwareFromDB)
printerPlacesRouter.get('/loadPrinterHardwareFromDBGrouped', printerPlacesController.loadPrinterHardwareFromDBGrouped)
printerPlacesRouter.get('/loadPrinterConsumableFromDB', printerPlacesController.loadPrinterConsumableFromDB)
printerPlacesRouter.get('/loadPrinterConsumableFromDBGrouped', printerPlacesController.loadPrinterConsumableFromDBGrouped)
printerPlacesRouter.post('/insertMoveConsumable', printerPlacesController.insertMoveConsumable)

module.exports = printerPlacesRouter