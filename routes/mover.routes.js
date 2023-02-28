const express = require('express')
const moverController = require('../controllers/mover.controllers')


const moverRouter = express.Router()

moverRouter.post('/movePrinterHardware', moverController.movePrinterHardware)

module.exports = moverRouter