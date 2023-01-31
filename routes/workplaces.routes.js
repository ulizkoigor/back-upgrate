const express = require('express')
const workplacesController = require('../controllers/workplaces.controllers')


const workplacesRouter = express.Router()

workplacesRouter.get('/loadFromDB', workplacesController.loadFromDB)
workplacesRouter.post('/insertIntoDB', workplacesController.insertIntoDB)

module.exports = workplacesRouter