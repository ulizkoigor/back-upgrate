const pool = require('../database/keys')

class consumableForPrintersController {

    getList = async (req, res) => {
        const consumableForPrintersList = await pool.query(`SELECT type, characteristics, COUNT(*) FROM get_consumable_for_printers_list('${req.query.type_for_search}','%${req.query.characteristics_for_search}%','${req.query.trebovanie_nakladnaya_for_search}','${req.query.nomenklatur_number_for_search}') GROUP BY type, characteristics`)
        res.json(consumableForPrintersList.rows)
    }

    makeMove = async (req, res) => {
        const id = await pool.query(`
            SELECT  make_move_consumable_for_printers('${req.body.consumable_for_printers_type}', 
                                                      '${req.body.consumable_for_printers_characteristics}', 
                                                       ${req.body.place_id},
                                                      '${req.body.date}',
                                                      '${req.body.printer_characteristics_at_time_of_movement}',
                                                      '${req.body.employee_name_at_time_of_movement}')
                                                      
        `)
        console.log(id)
        res.send(id.rows[0])
    }

    getHistoryForPlaceOfPrinterList = async (req, res) => {
        const {place_of_printer_id} = req.query
        const historyForPlaceOfPrinterList = await pool.query(
            `SELECT  consumable_for_printers_movement.id consumable_for_printers_movement_id,
                     consumable_for_printers_movement.consumable_for_printers_id consumable_for_printers_id,
                     consumable_for_printers_movement.place_id place_id,
                     consumable_for_printers_movement.date date,
                     consumable_for_printers_movement.printer_characteristics_at_time_of_movement printer_characteristics_at_time_of_movement,
                     consumable_for_printers_movement.employee_name_at_time_of_movement employee_name_at_time_of_movement,
                     consumable_for_printers.type consumable_for_printers_type,
                     consumable_for_printers.characteristics consumable_for_printers_characteristics,
                     place.building building,
                     place.room room,
                     place.department,
                     place.type_place_id type_place_id
               FROM  consumable_for_printers_movement
          LEFT JOIN  consumable_for_printers ON (consumable_for_printers_movement.consumable_for_printers_id = consumable_for_printers.id)
          LEFT JOIN  place ON (consumable_for_printers_movement.place_id = place.id)
              WHERE  (type_place_id = 2 AND consumable_for_printers_movement.place_id::text LIKE '${place_of_printer_id}')
           ORDER BY  consumable_for_printers_movement.date DESC`
        )
        res.json(historyForPlaceOfPrinterList.rows)
    }

    getDetailInformationAboutConsumableForPrinters = async (req, res) => {
        const {type_consumable_for_printers, characteristics_consumable_for_printers} = req.query
        const detailInformationAboutConsumableForPrinters = await  pool.query(`
            SELECT  *
              FROM  get_consumable_for_printers_list('${type_consumable_for_printers}','%${characteristics_consumable_for_printers}%','%','%')
        `)
        res.json(detailInformationAboutConsumableForPrinters.rows)
    }

    deleteMovement = async (req, res) => {
        const {consumable_for_printers_movement_id} = req.body
        await pool.query(`
            DELETE FROM consumable_for_printers_movement WHERE id = ${consumable_for_printers_movement_id}
        `)
        res.send()
    }
}
module.exports = new consumableForPrintersController()