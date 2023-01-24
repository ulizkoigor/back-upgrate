const express = require('express')
const hardwareForWorkplaceController = require('../controllers/hardwareForWorkplace.controllers')

const hardwareForWorkplaceRouter = express.Router()

hardwareForWorkplaceRouter.get('/loadFromDB', hardwareForWorkplaceController.loadFromDB)
hardwareForWorkplaceRouter.get('/loadFromDBGrouped', hardwareForWorkplaceController.loadFromDBGrouped)
//hardwareForWorkplaceRouter.post('/updateHardware', workplaceHardwareController.updateHardware)


hardwareForWorkplaceRouter.get('/getHardwareOfTrebovanieNakladnayaList', hardwareForWorkplaceController.getHardwareOfTrebovanieNakladnayaList)

hardwareForWorkplaceRouter.post('/makeMove', hardwareForWorkplaceController.makeMove)


hardwareForWorkplaceRouter.get('/getListHardwareForPlace', hardwareForWorkplaceController.getListHardwareForPlace)

hardwareForWorkplaceRouter.get('/getTypeMaterialValuesList', hardwareForWorkplaceController.getTypeMaterialValuesList)

hardwareForWorkplaceRouter.get('/getLastIdTrebovanieNakladnaya', hardwareForWorkplaceController.getLastIdTrebovanieNakladnaya)


hardwareForWorkplaceRouter.get('/getMovementList', hardwareForWorkplaceController.getMovementList)
hardwareForWorkplaceRouter.post('/addMovement', hardwareForWorkplaceController.addMovement)

hardwareForWorkplaceRouter.get('/getPlaceList', hardwareForWorkplaceController.getPlaceList)
hardwareForWorkplaceRouter.post('/addPlace', hardwareForWorkplaceController.addPlace)
hardwareForWorkplaceRouter.get('/getTypePlace', hardwareForWorkplaceController.getTypePlace)

module.exports = hardwareForWorkplaceRouter