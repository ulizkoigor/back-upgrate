const pool = require('../database/keys')

class moverController {

    movePrinterHardware = async (req, res) => {
        const {idPrinterHardware, idPrinterPlace, date} = req.body.params

        console.log(req.body.params)

        await pool.query(`

            SELECT move_printer_hardware(${idPrinterHardware}, ${idPrinterPlace}, '${date}')
             
        `).then(() => {
            res.send()
        }).catch((error) => {
            console.log(error.stack)
            res.status(500).send({name: error.name, message: error.message, stack: error.stack})
        })
    }

}

module.exports = new moverController()