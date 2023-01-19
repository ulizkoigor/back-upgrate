const pool = require('../database/keys')

class placeController {

    getPlaceOfPrinterList = async (req, res) => {
        const {status_for_search, id_for_search, type_hardware_id_for_search, characteristics_for_search, trebovanie_nakladnaya_id_for_search, nomenklatur_number_for_search, room_for_search, building_for_search, employee_name_for_search} = req.query
        const placeOfPrinterList = await pool.query(`
            SELECT  * 
              FROM  get_hardware_list_with_place('${status_for_search}',
                                      '${id_for_search}',
                                      '${type_hardware_id_for_search}',
                                      '%${characteristics_for_search}%',
                                      '${trebovanie_nakladnaya_id_for_search}',
                                      '${nomenklatur_number_for_search}')
             WHERE  (type = 'Принтер' OR type = 'МФУ')
                    AND LOWER (place_room) LIKE LOWER('%${room_for_search}%')
                    AND LOWER (place_building) LIKE LOWER ('%${building_for_search}%')
                    AND LOWER (employee_name) LIKE LOWER ('%${employee_name_for_search}%')
             
        `)
        res.json(placeOfPrinterList.rows)
    }

    getStockList = async (req, res) => {
        const count = await pool.query(`
            SELECT
                place.id place_id,
                place.building place_building,
                place.room place_room,
                type_place.title type_place_title
            FROM place
            LEFT JOIN type_place ON (place.type_place_id = type_place.id)
            WHERE (type_place.title = 'Склад')
            ORDER BY place.id`)
        res.json(count.rows)
    }

}
module.exports = new placeController()