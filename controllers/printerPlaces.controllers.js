const pool = require('../database/keys')

class printerPlacesController {

    loadFromDB = async (req, res) => { // подумать о названии loadFormDB
        await pool.query(`
            SELECT  printer_place.id id_printer_place,
                    printer_place.building building,
                    printer_place.room room,
                    printer_place.multi_users multi_users,
                    printer_place.department department,
                    printer_place.employee_position employee_position,
                    printer_place.employee_name employee_name,
                    printer_hardware.id id_hardware,
                    printer_hardware.type type_hardware,
                    printer_hardware.characteristics characteristics_hardware,
                    printer_hardware.id_trebovaniya id_trebovaniya,
                    printer_hardware.nomenclature_number nomenclature_number
              FROM  printer_place
         LEFT JOIN  printer_hardware ON printer_place.id_printer_hardware = printer_hardware.id
             WHERE (printer_place.id::TEXT LIKE '${req.query.idPrinterPlaceForSearch}' AND
                    printer_place.building LIKE '${req.query.buildingForSearch}' AND
                    printer_place.room LIKE '%${req.query.roomForSearch}%' AND
                    printer_place.department LIKE '${req.query.departmentForSearch}' AND
                    printer_place.multi_users::TEXT LIKE '${req.query.multiUsersForSearch}' AND
                    LOWER(printer_place.employee_position) LIKE LOWER('%${req.query.employeePositionForSearch}%') AND
                    LOWER(printer_place.employee_name) LIKE LOWER('%${req.query.employeeNameForSearch}%') AND
                    printer_hardware.id::TEXT LIKE '${req.query.idHardwareForSearch}' AND
                    printer_hardware.type LIKE '${req.query.typeHardwareForSearch}' AND
                    LOWER(printer_hardware.characteristics) LIKE LOWER('%${req.query.characteristicsHardwareForSearch}%') AND
                    printer_hardware.id_trebovaniya::TEXT LIKE '${req.query.idTrebovaniyaForSearch}' AND
                    LOWER(printer_hardware.nomenclature_number) LIKE LOWER('%${req.query.nomenclatureNumberForSearch}%'))
          ORDER BY  printer_place.id
        `).then((result) => {
            res.json(result.rows)
        }).catch((error) => {
            console.log(`${error}`)
        })
    }

    loadPrinterHardwareFromDB = async (req, res) => { // подумать о названии loadFormDB
        await pool.query(`SELECT * FROM merge_tables_printer_hardware_and_printer_place('${req.query.statusHardwareForSearch}',
                                                                                        '${req.query.idHardwareForSearch}',
                                                                                        '${req.query.typeHardwareForSearch}',
                                                                                        '%${req.query.characteristicsHardwareForSearch}%',
                                                                                        '%${req.query.nomenclatureNumberForSearch}',
                                                                                        '${req.query.idTrebovaniyaForSearch}',
                                                                                        '${req.query.idPrinterPlaceForSearch}')
                          WHERE (date >= '${req.query.dateStartPeriodForSearch}' AND
                                 date <= '${req.query.dateEndPeriodForSearch}') AND
                                 building LIKE '${req.query.buildingForSearch}' AND
                                 room LIKE '%${req.query.roomForSearch}%' AND
                                 department LIKE '${req.query.departmentForSearch}' AND
                                 LOWER(employee_position) LIKE LOWER('%${req.query.employeePositionForSearch}%') AND
                                 LOWER(employee_name) LIKE LOWER('%${req.query.employeeNameForSearch}%') AND
                                 multi_users::TEXT LIKE '${req.query.multiUsersForSearch}'
                          ORDER BY id_hardware DESC`)
            .then((result) => {

            res.json(result.rows)
        }).catch((error) => {
            console.log(`${error}`)
        })
    }
}

module.exports = new printerPlacesController()