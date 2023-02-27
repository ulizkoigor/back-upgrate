const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const requirementRouter = require('./routes/requirement.routes')

const printerHardwareRouter = require('./routes/printerHardware.routes')
const printerPlaceRouter = require('./routes/printerPlace.routes')

const hardwareForWorkplaceRouter = require('./routes/hardwareForWorkplace.routes')
const consumableForPrintersRouter = require('./routes/consumableForPrinters.routes')
const workplacesRouter = require('./routes/workplaces.routes')



const config = require("./config")

const PORT = config.listen_port

const app = express()

const pool = require('./database/keys')

app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/requirement/', requirementRouter)

app.use('/printerHardware/', printerHardwareRouter)
app.use('/printerPlace/', printerPlaceRouter)

app.use('/hardwareForWorkplace', hardwareForWorkplaceRouter)
app.use('/consumableForPrinters/', consumableForPrintersRouter)
app.use('/workplaces/', workplacesRouter)


app.get('/getDatabaseName', async (req, res) => {
    res.send(pool.options);
    })

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))