const express = require('express')
const requirementController = require('../controllers/requirement.controllers')


const requirementRouter = express.Router()

requirementRouter.post('/createRequirement', requirementController.createRequirement)
requirementRouter.post('/updateRequirement', requirementController.updateRequirement)
requirementRouter.post('/createDOCX', requirementController.createDOCX)

requirementRouter.get('/selectRequirement', requirementController.selectRequirement)

module.exports = requirementRouter