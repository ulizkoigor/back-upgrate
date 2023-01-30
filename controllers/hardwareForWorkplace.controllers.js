const pool = require('../database/keys')

class hardwareForWorkplaceController {
    loadFromDB = async (req, res) => {
        console.log(req.query)
        const hardwaresForWorkplace = await pool.query(`            
            SELECT  *
              FROM  join_hardwares_for_workplace_and_workplaces(${req.query.countHardwareForSearch}, '${req.query.statusForSearch}', '${req.query.superTypeForSearch}')
             WHERE  id_hardware::TEXT LIKE '${req.query.idHardwareForSearch}' AND

                    type_hardware LIKE '${req.query.typeHardwareForSearch}' AND
                    LOWER(characteristics) LIKE LOWER('%${req.query.characteristicsForSearch}%') AND
                    id_workplace::TEXT LIKE '${req.query.idWorkplaceForSearch}' AND
                    building LIKE '${req.query.buildingForSearch}' AND
                    room LIKE '%${req.query.roomForSearch}%' AND
                    department LIKE '${req.query.departmentForSearch}' AND
                    LOWER(employee_position) LIKE LOWER('%${req.query.positionForSearch}%') AND
                    LOWER(employee_name) LIKE LOWER('%${req.query.nameForSearch}%') AND
                    LOWER(nomenclature_number) LIKE LOWER('%${req.query.nomenclatureNumberForSearch}%') AND
                    type_material_values LIKE '${req.query.typeMaterialValuesForSearch}' AND
                    id_trebovanie::TEXT LIKE '${req.query.trebovanieForSearch}'
        `)
        console.log(hardwaresForWorkplace.rows)
        res.json(hardwaresForWorkplace.rows)
    }

    loadFromDBGrouped = async (req, res) => {
        const hardwaresForWorkplaceGrouped = await pool.query(`
            SELECT  hardwares_for_workplace.type type_hardware,
                    characteristics,
                    status,
                    COUNT(*)
              FROM  hardwares_for_workplace
             WHERE  (status LIKE '${req.query.statusForSearch}' AND
                     hardwares_for_workplace.type LIKE '${req.query.typeHardwareForSearch}' AND
                     LOWER(characteristics) LIKE LOWER('%${req.query.characteristicsForSearch}%') AND
                     hardwares_for_workplace.superType LIKE '${req.query.superTypeForSearch}'
                    )
          GROUP BY  type,
                    characteristics,
                    status
             LIMIT  ${req.query.countHardwareForSearch}
          `)
        res.json(hardwaresForWorkplaceGrouped.rows)
    }

/*    makeMove = async (req, res) => {
        console.log(req.body)

        const id = await pool.query(`
            SELECT  make_move_hardware('${req.body.type_hardware}', 
                                       '${req.body.characteristics_hardware}', 
                                        ${req.body.place_id},
                                       '${req.body.date}',
                                       '${req.body.employee_name_at_time_of_movement}')
                                                      
        `)
        console.log(id.rows[0])

        res.json()
    }*/

/*    getHardwareWithDetailInformationList = async (req, res) => {
        const hardwareListWithDetailInformationList = await pool.query(`
            SELECT 
        `)
    }

    updateHardware = async (req, res) => {
        await pool.query(`UPDATE hardware SET type_hardware_id = ${req.body.type_hardware_id}, characteristics = '${req.body.characteristics}', trebovanie_nakladnaya_id = ${req.body.trebovanie_nakladnaya_id}, nomenklatur_number = '${req.body.nomenklatur_number}' WHERE id = ${req.body.id}`).then(() => {
            res.send()
        })
    }*/

    getTypePlace = async (req, res) => {
        const typePlaceList = await pool.query(`SELECT * FROM type_place`)
        res.json(typePlaceList.rows)
    }

    getHardwareOfTrebovanieNakladnayaList = async (req, res) => {
        const hardwareOfTrebovanieNakladnayaList = await pool.query(`SELECT type_hardware.title type_hardware_title, characteristics, nomenklatur_number, COUNT(nomenklatur_number) FROM hardware left join type_hardware on hardware.type_hardware_id = type_hardware.id  WHERE trebovanie_nakladnaya_id = ${req.query.trebovanie_nakladnaya_id} group by nomenklatur_number, title, characteristics`)
        res.json(hardwareOfTrebovanieNakladnayaList.rows)
    }

    getLastIdTrebovanieNakladnaya = async (req, res) => {
        const lastIdTrebovanieNakladnaya = await pool.query(`SELECT last_value FROM trebovanie_nakladnaya_id_seq`)
        res.json(lastIdTrebovanieNakladnaya.rows[0])
    }

    getTypeMaterialValuesList = async (req, res) => {
        const typeMaterialValuesList = await pool.query(`select * from type_material_values order by id`)
        res.json(typeMaterialValuesList.rows)
    }

    getListHardwareForPlace = async (req, res) => {
        const listHardwareForPlace = await pool.query(`SELECT DISTINCT * FROM get_list_hardware_for_place(${req.query.place_id})`)
        res.json(listHardwareForPlace.rows)
    }

    getPlaceList = async (req, res) => {
        const placeList = await pool.query(`
            SELECT
                place.id,
                place.building building,
                place.room room,
                place.department department,
                place.employee_position employee_position,
                place.employee_name employee_name,
                type_place.title type_place_title,
                place.description description
            FROM place
            LEFT JOIN type_place ON (place.type_place_id = type_place.id)
            WHERE  (place.id::text LIKE '${req.query.place_id_for_search}'
                AND place.building LIKE '${req.query.building_for_search}'
                AND place.room LIKE '%${req.query.room_for_search}%'
                AND place.department LIKE '${req.query.department_for_search}'
                AND LOWER(place.employee_name) LIKE '%${req.query.name_for_search}%'
                AND LOWER(place.employee_position) LIKE '%${req.query.employee_position_for_search}%'
                AND type_place.title LIKE '${req.query.type_place_for_search}'
                AND place.description != 'Принтер/МФУ')
            ORDER BY id`)
        res.json(placeList.rows)
    }

    addPlace = async (req, res) => {
        await pool.query(`INSERT INTO place (building, room, department, employee_position, employee_name, description, type_place_id) VALUES ('${req.body.building}', '${req.body.room}', '${req.body.department}', '${req.body.employee_position}', '${req.body.employee_name}', '${req.body.description}', '${req.body.type_place_id}')`)
        res.send('ok')
    }

    getMovementList = async (req, res) => {
        const movementList = await pool.query(`
            SELECT
                movement.id,
                movement.date date,
                movement.employee_name_at_time_of_movement employee_name_at_time_of_movement,
                hardware.id hardware_id,
                hardware.type type_hardware,
                hardware.characteristics characteristics_hardware,
                place.id place_id,
                place.building building,
                place.room room,
                place.department,
                place.description place_description,
                place.employee_position employee_position,
                place.employee_name employee_name,
                type_place.title type_place_title
            FROM movement 
            LEFT JOIN hardware ON (movement.hardware_id = hardware.id)
            LEFT JOIN place ON (place.id = movement.place_id)
            LEFT JOIN type_place ON (place.type_place_id = type_place.id)
            WHERE (place.type_place_id <> 1)
            ORDER BY movement.date DESC
            `)
        res.json(movementList.rows)
    }

    addMovement = async (req, res) => {
        const {hardware_id, place_id, date} = req.body
        await pool.query(`INSERT INTO movement (hardware_id, place_id, date) VALUES (${hardware_id}, ${place_id}, '${date}')`)
        res.send("ok")
    }
}
module.exports = new hardwareForWorkplaceController()