const pool = require('../database/keys')

class printerPlacesController {

    loadFromDB = async (req, res) => { // подумать о названии loadFormDB
        await pool.query(`
            SELECT  printer_place.id id_printer_place,
                    printer_place.building building,
                    printer_place.room room,
                    printer_place.multi_users multi_users,
                    printer_place.department department,
                    printer_place.employee_position employee_position,
                    printer_place.employee_name employee_name,
                    printer_hardware.id id_hardware,
                    printer_hardware.type type_hardware,
                    printer_hardware.characteristics characteristics_hardware,
                    printer_hardware.id_trebovaniya id_trebovaniya,
                    printer_hardware.nomenclature_number nomenclature_number
              FROM  printer_place
         LEFT JOIN  printer_hardware ON printer_place.id_printer_hardware = printer_hardware.id
             WHERE (printer_place.id::TEXT LIKE '${req.query.idPrinterPlaceForSearch}' AND
                    printer_place.building LIKE '${req.query.buildingForSearch}' AND
                    printer_place.room LIKE '%${req.query.roomForSearch}%' AND
                    printer_place.department LIKE '${req.query.departmentForSearch}' AND
                    printer_place.multi_users::TEXT LIKE '${req.query.multiUsersForSearch}' AND
                    LOWER(printer_place.employee_position) LIKE LOWER('%${req.query.employeePositionForSearch}%') AND
                    LOWER(printer_place.employee_name) LIKE LOWER('%${req.query.employeeNameForSearch}%') AND
                    printer_hardware.id::TEXT LIKE '${req.query.idHardwareForSearch}' AND
                    printer_hardware.type LIKE '${req.query.typeHardwareForSearch}' AND
                    LOWER(printer_hardware.characteristics) LIKE LOWER('%${req.query.characteristicsHardwareForSearch}%') AND
                    printer_hardware.id_trebovaniya::TEXT LIKE '${req.query.idTrebovaniyaForSearch}' AND
                    LOWER(printer_hardware.nomenclature_number) LIKE LOWER('%${req.query.nomenclatureNumberForSearch}%'))
          ORDER BY  printer_place.id
        `).then((result) => {
            res.json(result.rows)
        }).catch((error) => {
            console.log(`${error}`)
        })
    }

    loadPrinterHardwareFromDBGrouped = async (req,res) => {
        await pool.query(`SELECT printer_hardware.status status_printer_hardware,
                                 printer_hardware.type type_printer_hardware,
                                 printer_hardware.characteristics characteristics_printer_hardware,
                                 COUNT(*)
                          FROM printer_hardware
                          WHERE printer_hardware.status LIKE '${req.query.statusPrinterHardwareForSearch}' AND
                                printer_hardware.type LIKE '${req.query.typePrinterHardwareForSearch}' AND
                                LOWER(printer_hardware.characteristics) LIKE LOWER('%${req.query.characteristicsPrinterHardwareForSearch}%')
                          GROUP BY printer_hardware.status,
                                   printer_hardware.type,
                                   printer_hardware.characteristics                                   
                          LIMIT  ${req.query.countForSearch}`)
            .then((result) => {
                res.json(result.rows)
            }).catch((error) => {
                console.log(`${error}`)
            })
    }

    loadPrinterHardwareFromDB = async (req, res) => { // подумать о названии loadFormDB
        await pool.query(`SELECT * FROM merge_tables_printer_hardware_and_printer_place('${req.query.statusPrinterHardwareForSearch}',
                                                                                        '${req.query.idPrinterHardwareForSearch}',
                                                                                        '${req.query.typePrinterHardwareForSearch}',
                                                                                        '%${req.query.characteristicsPrinterHardwareForSearch}%',
                                                                                        '%${req.query.nomenclatureNumberForSearch}',
                                                                                        '${req.query.idTrebovaniyaForSearch}')
                          WHERE (date >= '${req.query.dateStartPeriodForSearch}' AND
                                 date <= '${req.query.dateEndPeriodForSearch}') AND
                                 id_printer_place LIKE '${req.query.idPrinterPlaceForSearch}' AND
                                 building LIKE '${req.query.buildingForSearch}' AND
                                 room LIKE '%${req.query.roomForSearch}%' AND
                                 department LIKE '${req.query.departmentForSearch}' AND
                                 LOWER(employee_position) LIKE LOWER('%${req.query.employeePositionForSearch}%') AND
                                 LOWER(employee_name) LIKE LOWER('%${req.query.employeeNameForSearch}%') AND
                                 multi_users::TEXT LIKE '${req.query.multiUsersForSearch}'
                          ORDER BY id_printer_hardware DESC`)
            .then((result) => {
            res.json(result.rows)
        }).catch((error) => {
            console.log(`${error}`)
        })
    }

    loadPrinterConsumableFromDB = async (req, res) => { // подумать о названии loadFormDB
        await pool.query(`
            SELECT  printer_consumable.status status_printer_consumable,
                    printer_consumable.id id_printer_consumable,
                    printer_consumable.type type_printer_consumable,
                    printer_consumable.characteristics characteristics_printer_consumable,
                    printer_consumable.nomenclature_number nomenclature_number,
                    trebovaniya.id id_trebovaniya,
                    trebovaniya.date date,
                    trebovaniya.contractor contractor,
                    trebovaniya.shipping_document,
                    trebovaniya.an_invoice_for_payment an_invoice_for_payment
            FROM printer_consumable
            LEFT JOIN trebovaniya ON trebovaniya.id = printer_consumable.id_trebovaniya
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

    loadPrinterConsumableFromDBGrouped = async (req,res) => {
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
            let newIdPrinterConsumableMovement = result.rows[0].make_move_printer_consumable
            console.log(result.rows)
            console.log(result.rows[0])
            res.send(result.rows[0])
        }).catch((error) => {
            console.log(`${error}`)
        })
    }

    printerConsumableMovement_SELECT = async (req, res) => {
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
            res.send(result.rows)
        }).catch((error) => {
            console.log(`${error}`)
        })
    }

    RETURN_TO_STOCK_printerConsumable = async (req, res) => {
        console.log(req.body)
        await pool.query(`SELECT return_to_stock_and_delete_movement(${req.body.idPrinterConsumable}, ${req.body.idPrinterConsumableMovement})`).then(() => {
            res.send()
        }).catch((error) => {
            console.log(`${error}`)
        })
    }
}

module.exports = new printerPlacesController()