const pool = require('../database/keys')
const fs = require("fs");
const {createReport} = require("docx-templates");
const path = require("path");


class placeController {

    getList = async (req, res) => {
        const trebovanieNakladnayaList = await pool.query(`
               SELECT  trebovanie_nakladnaya.id id,
                       trebovanie_nakladnaya.date,
                       trebovanie_nakladnaya.comment,
                       trebovanie_nakladnaya.contractor,
                       trebovanie_nakladnaya.an_invoice_for_payment,
                       trebovanie_nakladnaya.shipping_document,
                       type_material_values.name type_material_values_name
                 FROM  trebovanie_nakladnaya
            LEFT JOIN  type_material_values ON trebovanie_nakladnaya.type_material_values_id = type_material_values.id
                WHERE  (trebovanie_nakladnaya.id::text LIKE '${req.query.id_for_search}')
             ORDER BY  trebovanie_nakladnaya.id
                 DESC
        `)

        res.json(trebovanieNakladnayaList.rows)
    }

    write = async (req, res) => {
        console.log(req.body)
        const {type_material_values_id_for_add, date_for_add, list_for_add, an_invoice_for_payment_for_add, shipping_document_for_add, contractor_for_add, comment_for_add} = req.body
        const new_trebovanie_nakladnaya_id = await pool.query(`
            SELECT  add_trebovanie_nakladnaya(${type_material_values_id_for_add}, 
                                             '${date_for_add}',
                                             '${contractor_for_add}',
                                             '${an_invoice_for_payment_for_add}',
                                             '${shipping_document_for_add}',
                                             '${comment_for_add}')`)
        for (const listForAddElement of list_for_add) {
            if (listForAddElement.type_for_add.superType === 'Аппаратное обеспечение для арм') {
                await pool.query(`
                SELECT  add_hardware(${listForAddElement.count_for_add},
                                     ${listForAddElement.stock_for_add.place_id},
                                    '${listForAddElement.type_for_add.title}',
                                    '${listForAddElement.characteristics_for_add}',
                                     ${new_trebovanie_nakladnaya_id.rows[0].add_trebovanie_nakladnaya},
                                    '${listForAddElement.nomenklatur_number_for_add}',
                                    '${date_for_add}')`)
            }
            else if (listForAddElement.type_for_add.superType === 'Расходные материалы для принтеров') {
                await pool.query(`
                SELECT  add_consumable_for_printers(${listForAddElement.count_for_add},
                                                    ${listForAddElement.stock_for_add.place_id},
                                                   '${listForAddElement.type_for_add.title}',
                                                   '${listForAddElement.characteristics_for_add}',
                                                    ${new_trebovanie_nakladnaya_id.rows[0].add_trebovanie_nakladnaya},
                                                   '${listForAddElement.nomenklatur_number_for_add}',
                                                   '${date_for_add}')`)
            }
        }
        res.send()
    }

    createDOCX = async (req, res) => {
        console.log(req.body)
        const {hardwareListForAdd, date} = req.body
        const template = fs.readFileSync('docx/TrebovanieNakladnayaTemplate.docx');
        const buffer = await createReport({
            template,
            data: {
                hardwareListForAdd: req.body.hardwareListForAdd,
                date: req.body.date,
            },
        });
        fs.writeFileSync('docx/TrebovanieNakladnaya.docx', buffer)
        res.sendFile(path.resolve(__dirname, '..', 'docx','TrebovanieNakladnaya.docx'))
    }
}

module.exports = new placeController()