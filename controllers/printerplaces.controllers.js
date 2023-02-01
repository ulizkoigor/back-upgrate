const pool = require('../database/keys')

class printerplacesController {

    loadFromDB = async (req, res) => { // подумать о названии loadFormDB
        await pool.query(`
            SELECT  printerplaces.id id_printerplace,
                    printerplaces.building building,
                    printerplaces.room room,
                    printerplaces.multiple_employees multiple_employees,
                    printerplaces.department department,
                    printerplaces.employee_position employee_position,
                    printerplaces.employee_name employee_name,
                    hardware_for_printerplaces.id id_hardware_for_printerplace,
                    hardware_for_printerplaces.type type_hardware_for_printerplace,
                    hardware_for_printerplaces.characteristics characteristics_hardware_for_printerplace,
                    hardware_for_printerplaces.id_trebovanie id_trebovanie,
                    hardware_for_printerplaces.nomenclature_number nomenclature_number
              FROM  printerplaces
         LEFT JOIN  hardware_for_printerplaces ON printerplaces.printer = hardware_for_printerplaces.id
          ORDER BY  printerplaces.id
        `).then((result) => {
            res.json(result.rows)
        }).catch((error) => {
            console.log(`Ошибка вот такая: ${error}`)
        })

    }

}

module.exports = new printerplacesController()