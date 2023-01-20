const express = require('express')
const workplacesController = require('../controllers/workplaces.controllers')


const workplacesRouter = express.Router()

workplacesRouter.get('/load', workplacesController.load)
workplacesRouter.get('/getPlaceOfPrinterList', workplacesController.getPlaceOfPrinterList)

module.exports = workplacesRouter