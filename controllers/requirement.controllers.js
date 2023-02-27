const pool = require('../database/keys')
const fs = require("fs");
const {createReport} = require("docx-templates");
const path = require("path");


class requirementController {

    updateRequirement = async (req, res) => {
        const {id, date, typeMaterialAssets, contractor, anInvoiceForPayment, shippingDocument, comment} = req.body.params

        await pool.query(`            
            
            UPDATE requirement
            SET date = '${date}',
                type_material_assets = '${typeMaterialAssets}',
                contractor = '${contractor}',
                an_invoice_for_payment = '${anInvoiceForPayment}',
                shipping_document = '${shippingDocument}',
                comment = '${comment}'
            WHERE id = ${id}
            
        `).then(() => {
            res.send()
        }).catch((error) => {
            console.log(error)
            res.status(404).send(`${error}`)
        })
    }

    createRequirement = async (req, res) => {
        const {date, typeMaterialAssets, contractor, anInvoiceForPayment, shippingDocument, comment, hardwareList} = req.body.params
        await pool.query(`

            INSERT INTO requirement(date, type_material_assets, contractor, an_invoice_for_payment, shipping_document, comment)
            VALUES('${date}', '${typeMaterialAssets}', '${contractor}', '${anInvoiceForPayment}', '${shippingDocument}', '${comment}')
            RETURNING id
            
        `).then(async (result) => {
            if (hardwareList.length > 0) {
                await pool.query(`SELECT create_hardware(${result.rows[0].id}, '${JSON.stringify(hardwareList)}')
                `).then(() => {
                    res.send()
                }).catch((error) => {
                    console.log(error)
                    res.status(404).send(`${error}`)
                })
            } else
                res.send()

        }).catch((error) => {
            res.status(404).send(`${error}`)
        })
    }

    selectRequirement = async (req, res) => {
        let {idRequirement, dateRequirement, typeMaterialAssets, contractor, shippingDocument, anInvoiceForPayment, commentRequirement} = req.query

        try {
            dateRequirement = JSON.parse(dateRequirement)

            if (idRequirement === '')
                idRequirement = '%'
            if (dateRequirement.startPeriod === '')
                dateRequirement.startPeriod = '2022-11-01'
            if (dateRequirement.endPeriod === '')
                dateRequirement.endPeriod = new Date().toISOString().split('T')[0]
            if (contractor === '')
                contractor = '%'
            if (shippingDocument === '')
                shippingDocument = '%'
            if (anInvoiceForPayment === '')
                anInvoiceForPayment = '%'
            if (commentRequirement === '')
                commentRequirement = '%'

            await pool.query(`
            SELECT id id_requirement,
                   date date_requirement,
                   type_material_assets type_material_assets,
                   contractor contractor,
                   shipping_document shipping_document,
                   an_invoice_for_payment an_invoice_for_payment,
                   comment comment_requirement
            FROM requirement
            WHERE id::TEXT LIKE '${idRequirement}'
            AND  (date >= '${dateRequirement.startPeriod} 00:00:00' AND date <= '${dateRequirement.endPeriod} 23:59:59')
            AND   type_material_assets LIKE '${typeMaterialAssets}'
            AND   LOWER(contractor) LIKE LOWER('%${contractor}%')
            AND   LOWER(shipping_document) LIKE LOWER('%${shippingDocument}%')
            AND   LOWER(an_invoice_for_payment) LIKE LOWER('%${anInvoiceForPayment}%')
            AND   LOWER(comment) LIKE LOWER('%${commentRequirement}%')
            ORDER BY id DESC
        `).then((result) => {
                res.json(result.rows)
            })
        } catch (error) {
            console.log(error.stack)
            res.status(500).send({name: error.name, message: error.message, stack: error.stack})
        }
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

module.exports = new requirementController()