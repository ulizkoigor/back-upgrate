const pool = require('../database/keys')

class workplacesController {

    loadFromDB = async (req, res) => { // подумать о названии loadFormDB
        await pool.query(`
            SELECT  * FROM  workplaces
             WHERE  (id::TEXT LIKE '${req.query.idForSearch}' AND
                     multiple_employees::TEXT LIKE '${req.query.multipleEmployeesForSearch}' AND
                     building LIKE '${req.query.buildingForSearch}' AND
                     room LIKE '%${req.query.roomForSearch}%' AND
                     department LIKE '${req.query.departmentForSearch}' AND
                     LOWER(employee_name) LIKE  LOWER('%${req.query.employeeNameForSearch}%') AND
                     LOWER(employee_position) LIKE LOWER('%${req.query.employeePositionForSearch}%')
                    )
          ORDER BY  id
        `).then((result) => {
            res.json(result.rows)
        }).catch((error) => {
            console.log(`Ошибка вот такая: ${error}`)
        })
    }

    insertIntoDB = async (req, res) => {
        console.log(req.body)
        await pool.query(`INSERT INTO workplaces (building, room, department, employee_position, employee_name, multiple_employees)
                          VALUES ('${req.body.building}', '${req.body.room}', '${req.body.department}',
                                  '${req.body.employeePosition}', '${req.body.employeeName}', '${req.body.multipleEmployees}')
        `).then(() => {
            res.send()
        }).catch((error) => {
            console.log(`Ошибка вот такая: ${error}`)
        })

    }

}

module.exports = new workplacesController()