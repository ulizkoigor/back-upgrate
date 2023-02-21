const pool = require('../database/keys')

class printerPlacesController {

    makeMovePrinterConsumable = async (req, res) => {
        await pool.query(`
            SELECT make_move_printer_consumable(${req.body.idPrinterConsumable},
                                                ${req.body.idPrinterPlace},
                                               '${req.body.date}',
                                               '${req.body.statusExploitation}')                
        `).then(() => {
            res.send()
        }).catch((error) => {
            res.status(404).send(`${error}`)
            console.log(`${error}`)
        })
    }


    selectPrinterPlace = async (req, res) => {
        await pool.query(`
            SELECT  printer_place.id id_printer_place,
                    printer_place.multi_users multi_users,
                    printer_place.building building,
                    printer_place.room room,
                    printer_place.department department,
                    printer_place.employee_position employee_position,
                    printer_place.employee_name employee_name,
                    printer_hardware.id id_printer_hardware,
                    printer_hardware.type type_printer_hardware,
                    printer_hardware.characteristics characteristics_printer_hardware
              FROM  printer_place
         LEFT JOIN  printer_hardware ON printer_place.id_printer_hardware = printer_hardware.id
             WHERE (printer_place.id::TEXT LIKE '${req.query.idPrinterPlaceForSearch}' AND
                    printer_place.building LIKE '${req.query.buildingForSearch}' AND
                    printer_place.room LIKE '%${req.query.roomForSearch}%' AND
                    printer_place.department LIKE '${req.query.departmentForSearch}' AND
                    printer_place.multi_users::TEXT LIKE '${req.query.multiUsersForSearch}' AND
                    LOWER(printer_place.employee_position) LIKE LOWER('%${req.query.employeePositionForSearch}%') AND
                    LOWER(printer_place.employee_name) LIKE LOWER('%${req.query.employeeNameForSearch}%') AND
                    printer_hardware.id::TEXT LIKE '${req.query.idPrinterHardwareForSearch}' AND
                    printer_hardware.type LIKE '${req.query.typePrinterHardwareForSearch}' AND
                    LOWER(printer_hardware.characteristics) LIKE LOWER('%${req.query.characteristicsPrinterHardwareForSearch}%'))
          ORDER BY  printer_place.id
        `).then((result) => {
            res.json(result.rows)
        }).catch((error) => {
            console.log(`${error}`)
        })
    }

    selectPrinterHardwareGrouped = async (req, res) => {
        await pool.query(`SELECT printer_hardware.status status_printer_hardware,
                                 printer_hardware.type type_printer_hardware,
                                 printer_hardware.characteristics characteristics_printer_hardware,
                                 COUNT(*)
                          FROM printer_hardware
                          WHERE printer_hardware.status LIKE '${req.query.statusPrinterHardware}' AND
                                printer_hardware.type LIKE '${req.query.typePrinterHardware}' AND
                                LOWER(printer_hardware.characteristics) LIKE LOWER('%${req.query.characteristicsPrinterHardware}%')
                          GROUP BY printer_hardware.status,
                                   printer_hardware.type,
                                   printer_hardware.characteristics                                   
                          LIMIT  ${req.query.count}`)
            .then((result) => {
                res.json(result.rows)
            }).catch((error) => {
                console.log(error)
            })
    }

    selectPrinterHardware = async (req, res) => {
        console.log(req.query)
        await pool.query(`SELECT * FROM merge_tables_printer_hardware_and_printer_place('${req.query.statusPrinterHardware}',
                                                                                        '${req.query.idPrinterHardware}',
                                                                                        '${req.query.typePrinterHardware}',
                                                                                        '%${req.query.characteristicsPrinterHardware}%',
                                                                                        '%${req.query.nomenclatureNumber}',
                                                                                        '${req.query.idTrebovaniya}')
                          WHERE (date >= '${req.query.dateStartPeriod}' AND
                                 date <= '${req.query.dateEndPeriod}') AND
                                 id_printer_place LIKE '${req.query.idPrinterPlace}' AND
                                 building LIKE '${req.query.building}' AND
                                 room LIKE '%${req.query.room}%' AND
                                 department LIKE '${req.query.department}' AND
                                 LOWER(employee_position) LIKE LOWER('%${req.query.employeePosition}%') AND
                                 LOWER(employee_name) LIKE LOWER('%${req.query.employeeName}%') AND
                                 multi_users::TEXT LIKE '${req.query.multiUsers}'
                          ORDER BY id_printer_hardware DESC`)
            .then((result) => {
                console.log(result.rows)
            res.json(result.rows)
        }).catch((error) => {
            console.log(`${error}`)
        })
    }

    selectPrinterConsumable = async (req, res) => { // подумать о названии loadFormDB
        await pool.query(`
            SELECT  printer_consumable.status status_printer_consumable,
                    printer_consumable.id id_printer_consumable,
                    printer_consumable.type type_printer_consumable,
                    printer_consumable.characteristics characteristics_printer_consumable,
                    printer_consumable.nomenclature_number nomenclature_number,
                    trebovaniya.id id_trebovaniya,
                    trebovaniya.date date_trebovaniya,
                    trebovaniya.contractor contractor,
                    trebovaniya.shipping_document,
                    trebovaniya.an_invoice_for_payment an_invoice_for_payment,
                    printer_place.id id_printer_place,
                    printer_place.building building,
                    printer_place.room room,
                    printer_place.department department,
                    printer_place.employee_position employee_position,
                    printer_place.employee_name employee_name,
                    printer_place.multi_users multi_users          
            FROM printer_consumable
            LEFT JOIN trebovaniya ON trebovaniya.id = printer_consumable.id_trebovaniya
            LEFT JOIN printer_place ON printer_consumable.id_printer_place = printer_place.id
            WHERE printer_consumable.status LIKE '${req.query.statusPrinterConsumableForSearch}' AND
                  printer_consumable.id::TEXT LIKE '${req.query.idPrinterConsumableForSearch}' AND
                  printer_consumable.type LIKE '${req.query.typePrinterConsumableForSearch}' AND
                  LOWER(printer_consumable.characteristics) LIKE LOWER('%${req.query.characteristicsPrinterConsumableForSearch}%') AND
                  LOWER(printer_consumable.nomenclature_number) LIKE LOWER('%${req.query.nomenclatureNumberForSearch}%') AND
                  trebovaniya.id::TEXT LIKE '${req.query.idTrebovaniyaForSearch}' AND
                  (trebovaniya.date >= '${req.query.dateStartPeriodForSearch}' AND trebovaniya.date <= '${req.query.dateEndPeriodForSearch}') AND
                  LOWER(trebovaniya.contractor) LIKE LOWER('%${req.query.contractorForSearch}%') AND
                  LOWER(trebovaniya.shipping_document) LIKE LOWER('%${req.query.shippingDocumentForSearch}%') AND
                  LOWER(trebovaniya.an_invoice_for_payment) LIKE LOWER('%${req.query.anInvoiceForPaymentForSearch}%')
            ORDER BY id_printer_consumable DESC
            LIMIT ${req.query.countForSearch}`)
            .then((result) => {
                res.json(result.rows)
            }).catch((error) => {
                console.log(`${error}`)
            })
    }

    selectPrinterConsumableGrouped = async (req,res) => {
        await pool.query(`SELECT printer_consumable.status status_printer_consumable,
                                 printer_consumable.type type_printer_consumable,
                                 printer_consumable.characteristics characteristics_printer_consumable,
                                 COUNT(*)
                          FROM printer_consumable
                          WHERE printer_consumable.status LIKE '${req.query.statusPrinterConsumableForSearch}' AND
                                printer_consumable.type LIKE '${req.query.typePrinterConsumableForSearch}' AND
                                LOWER(printer_consumable.characteristics) LIKE LOWER('%${req.query.characteristicsPrinterConsumableForSearch}%')
                          GROUP BY printer_consumable.status,
                                   printer_consumable.type,
                                   printer_consumable.characteristics                                   
                          LIMIT  ${req.query.countForSearch}`)
            .then((result) => {
                res.json(result.rows)
            }).catch((error) => {
                console.log(`${error}`)
            })
    }

    insertMoveConsumable = async (req, res) => {
        await pool.query(`
            SELECT make_move_printer_consumable(
                '${req.body.typePrinterConsumableForMoveOperation}',
                '${req.body.characteristicsPrinterConsumableForMoveOperation}',
                '${req.body.dateForMoveOperation}',
                 ${req.body.idPrinterPlaceForMoveOperation})
        `).then((result) => {
            res.send(result.rows[0])
        }).catch((error) => {
            console.log(`${error}`)
        })
    }

    selectPrinterConsumableMovement = async (req, res) => {
        console.log(req.query)
        await pool.query(`
            SELECT printer_consumable_movement.id id_printer_consumable_movement,
                   printer_consumable_movement.date date_movement,                   
                   printer_consumable.id id_printer_consumable,
                   printer_consumable.type type_printer_consumable,
                   printer_consumable.characteristics characteristics_printer_consumable,
                   printer_hardware.id id_printer_hardware,
                   printer_hardware.type type_printer_hardware,
                   printer_hardware.characteristics characteristics_printer_hardware,
                   printer_consumable_movement.id_printer_place id_printer_place,
                   printer_consumable_movement.building building,
                   printer_consumable_movement.room room,
                   printer_consumable_movement.department department,
                   printer_consumable_movement.employee_position employee_position,
                   printer_consumable_movement.employee_name employee_name,
                   printer_place.multi_users multi_users
            FROM printer_consumable_movement
            LEFT JOIN printer_consumable ON printer_consumable.id = printer_consumable_movement.id_printer_consumable
            LEFT JOIN printer_hardware ON printer_hardware.id = printer_consumable_movement.id_printer_hardware
            LEFT JOIN printer_place ON printer_place.id = printer_consumable_movement.id_printer_place
            WHERE printer_consumable_movement.id::TEXT LIKE '${req.query.idPrinterConsumableMovement}' AND
                 (printer_consumable_movement.date >= '${req.query.dateStartPeriodForSearch}' AND printer_consumable_movement.date <= '${req.query.dateEndPeriodForSearch}') AND                 
                  printer_consumable.id::TEXT LIKE '${req.query.idPrinterConsumable}' AND
                  printer_consumable.type LIKE '${req.query.typePrinterConsumable}' AND
                  LOWER(printer_consumable.characteristics) LIKE LOWER('%${req.query.characteristicsPrinterConsumable}%') AND
                  printer_hardware.id::TEXT LIKE '${req.query.idPrinterHardware}' AND 
                  printer_hardware.type LIKE '${req.query.typePrinterHardware}' AND
                  LOWER(printer_hardware.characteristics) LIKE LOWER('%${req.query.characteristicsPrinterHardware}%') AND
                  printer_consumable_movement.id_printer_place::TEXT LIKE '${req.query.idPrinterPlace}' AND
                  printer_consumable_movement.building LIKE '${req.query.building}' AND
                  printer_consumable_movement.room LIKE '%${req.query.room}%' AND
                  printer_consumable_movement.department LIKE '${req.query.department}' AND
                  LOWER(printer_consumable_movement.employee_position) LIKE LOWER('%${req.query.employeePosition}%') AND
                  LOWER(printer_consumable_movement.employee_name) LIKE LOWER('%${req.query.employeeName}%') AND
                  printer_place.multi_users::TEXT LIKE '${req.query.multiUsers}'         
            ORDER BY printer_consumable_movement.date
            DESC
        `).then((result) => {
            console.log(result.rows)
            res.json(result.rows)
        }).catch((error) => {
            console.log(`${error}`)
        })
    }

    selectPrinterHardwareMovement = async (req, res) => {
        console.log(req.query)
        await pool.query(`
            SELECT printer_hardware_movement.id id_printer_hardware_movement,
                   printer_hardware_movement.date date_printer_hardware_movement,
                   printer_hardware_movement.status status_printer_hardware,
                   printer_hardware_movement.id_printer_hardware id_printer_hardware,
                   printer_hardware.type type_printer_hardware,
                   printer_hardware.characteristics characteristics_printer_hardware,
                   printer_hardware_movement.id_printer_place,
                   printer_hardware_movement.building,
                   printer_hardware_movement.room,
                   printer_hardware_movement.department,
                   printer_hardware_movement.employee_position,
                   printer_hardware_movement.employee_name         
            FROM printer_hardware_movement
            LEFT JOIN printer_hardware ON printer_hardware_movement.id_printer_hardware = printer_hardware.id
            WHERE printer_hardware_movement.id::TEXT LIKE '${req.query.idPrinterHardwareMovement}' AND
                 (printer_hardware_movement.date >= '${req.query.dateStartPeriod}' AND printer_hardware_movement.date <= '${req.query.dateEndPeriod}') AND
                  printer_hardware_movement.status LIKE '${req.query.statusPrinterHardware}' AND
                  printer_hardware_movement.id_printer_hardware::TEXT LIKE '${req.query.idPrinterHardware}' AND
                  printer_hardware.type LIKE '${req.query.typePrinterHardware}' AND
                  LOWER(printer_hardware.characteristics) LIKE LOWER('%${req.query.characteristicsPrinterHardware}%') AND
                  printer_hardware_movement.id_printer_place::TEXT LIKE '${req.query.idPrinterPlace}' AND
                  printer_hardware_movement.building LIKE '${req.query.building}' AND
                  printer_hardware_movement.room LIKE '%${req.query.room}%' AND
                  printer_hardware_movement.department LIKE '${req.query.department}' AND
                  printer_hardware_movement.employee_position LIKE '${req.query.employeePosition}' AND
                  printer_hardware_movement.employee_name LIKE '${req.query.employeeName}'
            ORDER BY printer_hardware_movement.date
            DESC
        `).then((result) => {
            console.log(result.rows)
            res.json(result.rows)
        }).catch((error) => {
            res.status(404).send(`${error}`)
            console.log(`${error}`)
        })
    }

    RETURN_TO_STOCK_printerConsumable = async (req, res) => {
        await pool.query(`SELECT return_to_stock_and_delete_movement(${req.body.idPrinterConsumable}, ${req.body.idPrinterConsumableMovement})`).then(() => {
            res.send()
        }).catch((error) => {
            console.log(`${error}`)
        })
    }

    updatePrinterPlace = async (req, res) => {
        await pool.query(`

            UPDATE printer_place SET
                multi_users = '${req.body.multiUsers}',
                building = '${req.body.building}',
                room = '${req.body.room}',
                department = '${req.body.department}',
                employee_position = '${req.body.employeePosition}',
                employee_name = '${req.body.employeeName}'
            WHERE id = ${req.body.idPrinterPlace}
            RETURNING *
            
        `).then((result) => {
            console.log(result.rows[0])
            res.send(result.rows[0])
        }).catch((error) => {
            console.log(`${error}`)
        })
    }

    insertPrinterPlaceUpdatePrinterHardware = async(req, res) => {
        await pool.query(`        
            SELECT make_move_printer_hardware(
                '${req.body.multi_users}',
                '${req.body.building}',
                '${req.body.room}',
                '${req.body.department}',
                '${req.body.employee_position}',
                '${req.body.employee_name}',
                '${req.body.type_printer_hardware}',
                '${req.body.characteristics_printer_hardware}',
                '${req.body.date}',
                '${req.body.stock_label}',
                '${req.body.exploitation_label}')
        `).then(() => {
            res.send()
        }).catch((error) => {
            res.status(404).send(`${error}`)
            console.log(`${error}`)
        })
    }
}

module.exports = new printerPlacesController()