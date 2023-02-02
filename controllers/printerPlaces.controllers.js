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
                    hardware_for_printer_places.id id_hardware_for_printer_place,
                    hardware_for_printer_places.type type_hardware_for_printer_place,
                    hardware_for_printer_places.characteristics characteristics_hardware_for_printer_place,
                    hardware_for_printer_places.id_trebovanie id_trebovanie,
                    hardware_for_printer_places.nomenclature_number nomenclature_number
              FROM  printer_places
         LEFT JOIN  hardware_for_printer_places ON printer_places.printer = hardware_for_printer_places.id
             WHERE (printer_places.id::TEXT LIKE '${req.query.idPrinterPlaceForSearch}' AND
                    printer_places.building LIKE '${req.query.buildingForSearch}' AND
                    printer_places.room LIKE '%${req.query.roomForSearch}%' AND
                    printer_places.department LIKE '${req.query.departmentForSearch}' AND
                    printer_places.multi_users::TEXT LIKE '${req.query.multiUsersForSearch}' AND
                    LOWER(printer_places.employee_position) LIKE LOWER('%${req.query.employeePositionForSearch}%') AND
                    LOWER(printer_places.employee_name) LIKE LOWER('%${req.query.employeeNameForSearch}%') AND
                    hardware_for_printer_places.id::TEXT LIKE '${req.query.idHardwareForPrinterPlaceForSearch}' AND
                    hardware_for_printer_places.type LIKE '${req.query.typeHardwareForPrinterPlaceForSearch}' AND
                    LOWER(hardware_for_printer_places.characteristics) LIKE LOWER('%${req.query.characteristicsHardwareForPrinterPlaceForSearch}%') AND
                    hardware_for_printer_places.id_trebovanie::TEXT LIKE '${req.query.idTrebovanieForSearch}' AND
                    LOWER(hardware_for_printer_places.nomenclature_number) LIKE LOWER('%${req.query.nomenclatureNumberForSearch}%'))
          ORDER BY  printer_places.id
        `).then((result) => {
            res.json(result.rows)
        }).catch((error) => {
            console.log(`Ошибка вот такая: ${error}`)
        })
    }

    loadHardwareForPrinterPlacesFromDB = async (req, res) => { // подумать о названии loadFormDB
        await pool.query(`
            SELECT  hardware_for_printer_places.id id_hardware_for_printer_places,
                    hardware_for_printer_places.status status,
                    hardware_for_printer_places.type type_hardware_for_printer_places,
                    hardware_for_printer_places.characteristics characteristics_hardware_printer_place,
                    hardware_for_printer_places.id_printer_place id_printer_place
              FROM  hardware_for_printer_places
             WHERE (hardware_for_printer_places.id::TEXT LIKE '${req.query.idHardwareForSearch}' AND
                    hardware_for_printer_places.status LIKE '${req.query.statusForSearch}' AND
                    hardware_for_printer_places.type LIKE '${req.query.typeHardwareForPrinterPlacesForSearch}' AND
                    LOWER(hardware_for_printer_places.characteristics) LIKE LOWER('%${req.query.characteristicsHardwarePrinterPlaceForSearch}%') AND
                    ${ req.query.idPrinterPlaceForSearch === '%' ? '(hardware_for_printer_places.id_printer_place IS NULL OR hardware_for_printer_places.id_printer_place IS NOT NULL)':
                                                                    `hardware_for_printer_places.id_printer_place::TEXT LIKE '${req.query.idPrinterPlaceForSearch}'`  }
                   )
          ORDER BY  hardware_for_printer_places.id
        `).then((result) => {
            res.json(result.rows)
        }).catch((error) => {
            console.log(`Ошибка вот такая: ${error}`)
        })
    }
}

module.exports = new printerPlacesController()