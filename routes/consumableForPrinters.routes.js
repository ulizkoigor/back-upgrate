const express = require('express')
const consumableForPrintersController = require('../controllers/consumableForPrinters.controllers')
const placeController = require("../controllers/place.controllers");

const consumableForPrintersRouter = express.Router()

consumableForPrintersRouter.get('/getList', consumableForPrintersController.getList)
consumableForPrintersRouter.get('/getHistoryForPlaceOfPrinterList', consumableForPrintersController.getHistoryForPlaceOfPrinterList)
consumableForPrintersRouter.get('/getDetailInformationAboutConsumableForPrinters', consumableForPrintersController.getDetailInformationAboutConsumableForPrinters)

consumableForPrintersRouter.post('/makeMove', consumableForPrintersController.makeMove)
consumableForPrintersRouter.post('/deleteMovement', consumableForPrintersController.deleteMovement)


module.exports = consumableForPrintersRouter