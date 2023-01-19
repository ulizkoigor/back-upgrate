const express = require('express')
const trebovanieNakladnayaController = require('../controllers/trebovanieNakladnaya.controllers')


const trebovanieNakladnayaRouter = express.Router()

trebovanieNakladnayaRouter.get('/getList', trebovanieNakladnayaController.getList)
trebovanieNakladnayaRouter.post('/write', trebovanieNakladnayaController.write)
trebovanieNakladnayaRouter.post('/createDOCX', trebovanieNakladnayaController.createDOCX)

module.exports = trebovanieNakladnayaRouter