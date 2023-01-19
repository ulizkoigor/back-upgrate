const express = require('express')
const workplaceHardwareController = require('../controllers/workplaceHardware.controllers')

const workplaceHardwareRouter = express.Router()

workplaceHardwareRouter.get('/load', workplaceHardwareController.load)
workplaceHardwareRouter.get('/loadGrouped', workplaceHardwareController.loadGrouped)
//workplaceHardwareRouter.post('/updateHardware', workplaceHardwareController.updateHardware)


workplaceHardwareRouter.get('/getHardwareOfTrebovanieNakladnayaList', workplaceHardwareController.getHardwareOfTrebovanieNakladnayaList)

workplaceHardwareRouter.post('/makeMove', workplaceHardwareController.makeMove)


workplaceHardwareRouter.get('/getListHardwareForPlace', workplaceHardwareController.getListHardwareForPlace)

workplaceHardwareRouter.get('/getTypeMaterialValuesList', workplaceHardwareController.getTypeMaterialValuesList)

workplaceHardwareRouter.get('/getLastIdTrebovanieNakladnaya', workplaceHardwareController.getLastIdTrebovanieNakladnaya)


workplaceHardwareRouter.get('/getMovementList', workplaceHardwareController.getMovementList)
workplaceHardwareRouter.post('/addMovement', workplaceHardwareController.addMovement)

workplaceHardwareRouter.get('/getPlaceList', workplaceHardwareController.getPlaceList)
workplaceHardwareRouter.post('/addPlace', workplaceHardwareController.addPlace)
workplaceHardwareRouter.get('/getTypePlace', workplaceHardwareController.getTypePlace)

module.exports = workplaceHardwareRouter