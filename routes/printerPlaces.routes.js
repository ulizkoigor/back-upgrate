const express = require('express')
const printerPlacesController = require('../controllers/printerPlaces.controllers')


const printerPlacesRouter = express.Router()

printerPlacesRouter.get('/loadFromDB', printerPlacesController.loadFromDB)
printerPlacesRouter.get('/loadHardwareForPrinterPlacesFromDB', printerPlacesController.loadHardwareForPrinterPlacesFromDB)

module.exports = printerPlacesRouter