const pool = require('../database/keys')

class printerplacesController {

    loadFromDB = async (req, res) => { // подумать о названии loadFormDB
        const count = await pool.query(`
            SELECT id id_printerplaces, id_workplace, building, room, department FROM printerplaces ORDER BY id_printerplaces
          `)
        res.json(count.rows)
    }

}

module.exports = new printerplacesController()