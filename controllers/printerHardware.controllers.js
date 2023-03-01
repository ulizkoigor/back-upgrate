const pool = require('../database/keys')

class printerHardwareController {

    leftJoinPrinterHardwareAndPrinterPlace = async (req, res) => {
        await pool.query(`

            SELECT printer_hardware.id id_printer_hardware,
                   printer_hardware.status status_printer_hardware,
                   printer_hardware.type type_printer_hardware,
                   printer_hardware.characteristics characteristics_printer_hardware,
                   printer_hardware.nomenclature_number nomenclature_number_printer_hardware,
                   printer_hardware.id_requirement id_requirement_printer_hardware,
                   printer_hardware.id_printer_place id_printer_place,
                   printer_hardware.comment comment_printer_hardware,
                   printer_place.building building,
                   printer_place.room room,
                   printer_place.department department,
                   printer_place.multi_users multi_users,
                   printer_place.employee_position employee_position,
                   printer_place.employee_name employee_name
            FROM printer_hardware
            LEFT JOIN printer_place ON printer_hardware.id_printer_place = printer_place.id
            ORDER BY printer_hardware.id DESC
                  
                `).then((result) => {
            res.json(result.rows)
        }).catch((error) => {
            console.log(error)
            res.status(404).send(`${error}`)
        })
    }

    selectMovementPrinterHardware = async (req, res) => {
        let {idMovementPrinterHardware,
            dateMovementPrinterHardware,
            idPrinterHardware,
            statusPrinterHardware,
            idPrinterPlace,
            buildingAtTimeOfMove,
            roomAtTimeOfMove,
            departmentAtTimeOfMove,
            employeePositionAtTimeOfMove,
            employeeNameAtTimeOfMove} = req.query

        try {
            dateMovementPrinterHardware = JSON.parse(dateMovementPrinterHardware)

            if (idMovementPrinterHardware === '')
                idMovementPrinterHardware = '%'
            if (dateMovementPrinterHardware.startPeriod === '')
                dateMovementPrinterHardware.startPeriod = '2022-11-01'
            if (dateMovementPrinterHardware.endPeriod === '')
                dateMovementPrinterHardware.endPeriod = new Date().toISOString().split('T')[0]
            if (idPrinterHardware === '')
                idPrinterHardware = '%'
            if (idPrinterPlace === '')
                idPrinterPlace = '%'
            if (roomAtTimeOfMove === '')
                roomAtTimeOfMove = '%'
            if (employeePositionAtTimeOfMove === '')
                employeePositionAtTimeOfMove = '%'
            if (employeeNameAtTimeOfMove === '')
                employeeNameAtTimeOfMove = '%'

            await pool.query(`

            SELECT * FROM movement_printer_hardware 
            WHERE id::TEXT LIKE '${idMovementPrinterHardware}'
            AND (date >= '${dateMovementPrinterHardware.startPeriod} 00:00:00' AND date <= '${dateMovementPrinterHardware.endPeriod} 23:59:59')
            AND id_printer_hardware::TEXT LIKE '${idPrinterHardware}'
            AND status LIKE '${statusPrinterHardware}'
            AND COALESCE(id_printer_place, 0)::TEXT LIKE '${idPrinterPlace}'
            AND building_at_time_of_move LIKE '${buildingAtTimeOfMove}'
            AND room_at_time_of_move LIKE '%${roomAtTimeOfMove}%'
            AND department_at_time_of_move LIKE '${departmentAtTimeOfMove}'
            AND LOWER(employee_position_at_time_of_move) LIKE LOWER('%${employeePositionAtTimeOfMove}%')
            AND LOWER(employee_name_at_time_of_move) LIKE LOWER('%${employeeNameAtTimeOfMove}%')
            ORDER BY date DESC
                  
        `).then((result) => {
                res.json(result.rows)
            })
        } catch (error) {
            console.log(error)
            res.status(404).send(`${error}`)
        }
    }

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