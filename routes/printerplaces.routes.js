const express = require('express')
const printerplacesController = require('../controllers/printerplaces.controllers')


const printerplacesRouter = express.Router()

printerplacesRouter.get('/loadFromDB', printerplacesController.loadFromDB)

module.exports = printerplacesRouter