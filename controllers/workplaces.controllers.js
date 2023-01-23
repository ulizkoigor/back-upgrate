const pool = require('../database/keys')

class workplacesController {

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

    load = async (req, res) => { // подумать о названии loadFormDB
        const count = await pool.query(`
            SELECT  * FROM  place
             WHERE  (
                                    id::TEXT LIKE '${req.query.idForSearch}' AND
                                        type LIKE '${req.query.typeForSearch}' AND
                                    building LIKE '${req.query.buildingForSearch}' AND
                                        room LIKE '%${req.query.roomForSearch}%' AND
                                  department LIKE '${req.query.departmentForSearch}' AND
                        LOWER(employee_name) LIKE  LOWER('%${req.query.employeeNameForSearch}%') AND
                    LOWER(employee_position) LIKE LOWER('%${req.query.employeePositionForSearch}%')
                    )
          ORDER BY  id
          `)
        res.json(count.rows)
    }

}

module.exports = new workplacesController()