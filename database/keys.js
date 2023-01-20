const Pool = require('pg').Pool

const pool = new Pool({
    host: '192.168.200.17',
    port: 5432,
    user: 'admmetro',
    password: 'Xrfkjdf_1D',
    database: 'upgrade'
})

module.exports = pool