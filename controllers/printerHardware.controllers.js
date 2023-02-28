const pool = require('../database/keys')

class printerHardwareController {

    selectPrinterHardware = async (req, res) => {
        let {idPrinterHardware,
            statusPrinterHardware,
            typePrinterHardware,
            characteristicsPrinterHardware,
            nomenclatureNumberPrinterHardware,
            idRequirementPrinterHardware,
            idPrinterPlace,
            comment,
            grouped} = req.query

        if (idPrinterHardware === '')
            idPrinterHardware = '%'
        if (characteristicsPrinterHardware === '')
            characteristicsPrinterHardware = '%'
        if (nomenclatureNumberPrinterHardware === '')
            nomenclatureNumberPrinterHardware = '%'
        if (idRequirementPrinterHardware === '')
            idRequirementPrinterHardware = '%'
        if (idPrinterPlace === '')
            idPrinterPlace = '%'
        if (comment === '')
            comment = '%'

        if (grouped === 'true')
            await pool.query(`
            SELECT status status_printer_hardware,
                   type type_printer_hardware,
                   characteristics characteristics_printer_hardware,
                   COUNT(*)          
            FROM printer_hardware
            WHERE status LIKE '${statusPrinterHardware}'
            AND   type LIKE '${typePrinterHardware}'
            AND   LOWER(characteristics) LIKE LOWER('%${characteristicsPrinterHardware}%')
            GROUP BY  status,
                      type,
                      characteristics                      
                `).then((result) => {
                    res.json(result.rows)
                }).catch((error) => {
                    console.log(error)
                    res.status(404).send(`${error}`)
                })
        else if (grouped === 'false')
            await pool.query(`
            SELECT id id_printer_hardware,
                   status status_printer_hardware,
                   type type_printer_hardware,
                   characteristics characteristics_printer_hardware,
                   nomenclature_number nomenclature_number_printer_hardware,
                   id_requirement id_requirement_printer_hardware,
                   id_printer_place id_printer_place,
                   comment comment_printer_hardware                    
            FROM printer_hardware
            WHERE id::TEXT LIKE '${idPrinterHardware}'
            AND   status LIKE '${statusPrinterHardware}'
            AND   type LIKE '${typePrinterHardware}'
            AND   LOWER(characteristics) LIKE LOWER('%${characteristicsPrinterHardware}%')
            AND   LOWER(nomenclature_number) LIKE LOWER('%${nomenclatureNumberPrinterHardware}%')
            AND   COALESCE(id_requirement, 0)::TEXT LIKE '${idRequirementPrinterHardware}'
            AND   COALESCE(id_printer_place, 0)::TEXT LIKE '${idPrinterPlace}'
            AND   LOWER(comment) LIKE LOWER('%${comment}%')
            ORDER BY id DESC`)
                .then((result) => {
                    res.json(result.rows)
                }).catch((error) => {
                    console.log(error)
                    res.status(404).send(`${error}`)
                })
    }
}

module.exports = new printerHardwareController()