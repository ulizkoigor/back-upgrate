const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const hardwareForWorkplaceRouter = require('./routes/hardwareForWorkplace.routes')
const consumableForPrintersRouter = require('./routes/consumableForPrinters.routes')
const workplacesRouter = require('./routes/workplaces.routes')
const trebovanieNakladnayaRouter = require('./routes/trebovanieNakladnaya.routes')

const config = require("./config")

const PORT = config.listen_port

const app = express()

const pool = require('./database/keys')

app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/hardwareForWorkplace', hardwareForWorkplaceRouter)
app.use('/consumableForPrinters/', consumableForPrintersRouter)
app.use('/workplaces/', workplacesRouter)
app.use('/trebovanieNakladnaya/', trebovanieNakladnayaRouter)

app.get('/getDatabaseName', async (req, res) => {
    res.send(pool.options);
    })

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))