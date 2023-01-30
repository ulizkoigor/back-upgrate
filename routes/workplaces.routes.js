const express = require('express')
const workplacesController = require('../controllers/workplaces.controllers')


const workplacesRouter = express.Router()

workplacesRouter.get('/loadFromDB', workplacesController.loadFromDB)
workplacesRouter.get('/getPlaceOfPrinterList', workplacesController.getPlaceOfPrinterList)

module.exports = workplacesRouter