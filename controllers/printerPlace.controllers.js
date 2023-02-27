const pool = require('../database/keys')

class printerPlaceController {

    selectPrinterPlace = async (req, res) => {
        let {idPrinterPlace,
             building,
             room,
             department,
             multiUsers,
             employeePosition,
             employeeName} = req.query

        try {
            if (idPrinterPlace === '')
                idPrinterPlace = '%'
            if (room === '')
                room = '%'
            if (employeePosition === '')
                employeePosition = '%'
            if (employeeName === '')
                employeeName = '%'

            await pool.query(`

            SELECT id id_printer_place,
                   building building,
                   room room,
                   department department,
                   multi_users multi_users,
                   employee_position employee_position,
                   employee_name employee_name             
            FROM printer_place
            WHERE id::TEXT LIKE '${idPrinterPlace}'
            AND   building LIKE '${building}'
            AND   room LIKE '%${room}%'
            AND   department LIKE '${department}'
            AND   multi_users::TEXT LIKE '${multiUsers}'
            AND   LOWER(employee_position) LIKE LOWER('%${employeePosition}%')
            AND   LOWER(employee_name) LIKE LOWER('%${employeeName}%')
            ORDER BY id DESC
            
            `).then((result) => {
                console.log(result.rows)
                res.json(result.rows)
            })
        } catch (error) {
            console.log(error.stack)
            res.status(500).send({name: error.name, message: error.message, stack: error.stack})
        }

    }

}

module.exports = new printerPlaceController()