const pool = require('../database/keys')

class printerPlacesController {

    loadFromDB = async (req, res) => { // подумать о названии loadFormDB
        await pool.query(`
            SELECT  printer_places.id id_printer_place,
                    printer_places.building building,
                    printer_places.room room,
                    printer_places.multi_users multi_users,
                    printer_places.department department,
                    printer_places.employee_position employee_position,
                    printer_places.employee_name employee_name,
                    printer_hardware.id id_hardware,
                    printer_hardware.type type_hardware,
                    printer_hardware.characteristics characteristics_hardware,
                    printer_hardware.id_trebovaniya id_trebovaniya,
                    printer_hardware.nomenclature_number nomenclature_number
              FROM  printer_places
         LEFT JOIN  printer_hardware ON printer_places.printer = printer_hardware.id
             WHERE (printer_places.id::TEXT LIKE '${req.query.idPrinterPlaceForSearch}' AND
                    printer_places.building LIKE '${req.query.buildingForSearch}' AND
                    printer_places.room LIKE '%${req.query.roomForSearch}%' AND
                    printer_places.department LIKE '${req.query.departmentForSearch}' AND
                    printer_places.multi_users::TEXT LIKE '${req.query.multiUsersForSearch}' AND
                    LOWER(printer_places.employee_position) LIKE LOWER('%${req.query.employeePositionForSearch}%') AND
                    LOWER(printer_places.employee_name) LIKE LOWER('%${req.query.employeeNameForSearch}%') AND
                    printer_hardware.id::TEXT LIKE '${req.query.idHardwareForSearch}' AND
                    printer_hardware.type LIKE '${req.query.typeHardwareForSearch}' AND
                    LOWER(printer_hardware.characteristics) LIKE LOWER('%${req.query.characteristicsHardwareForSearch}%') AND
                    printer_hardware.id_trebovaniya::TEXT LIKE '${req.query.idTrebovaniyaForSearch}' AND
                    LOWER(printer_hardware.nomenclature_number) LIKE LOWER('%${req.query.nomenclatureNumberForSearch}%'))
          ORDER BY  printer_places.id
        `).then((result) => {
            console.log(result.rows)
            res.json(result.rows)
        }).catch((error) => {
            console.log(`${error}`)
        })
    }

    loadPrinterHardwareFromDB = async (req, res) => { // подумать о названии loadFormDB
        await pool.query(`SELECT * FROM merge_tables_printer_hardware_and_printer_places() ORDER BY id_hardware DESC`).then((result) => {
            res.json(result.rows)
        }).catch((error) => {
            console.log(`${error}`)
        })
    }
}

module.exports = new printerPlacesController()