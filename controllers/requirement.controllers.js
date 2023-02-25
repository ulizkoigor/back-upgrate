const pool = require('../database/keys')
const fs = require("fs");
const {createReport} = require("docx-templates");
const path = require("path");


class requirementController {

    createRequirement = async (req, res) => {
        const {date, typeMaterialAssets, contractor, anInvoiceForPayment, shippingDocument, comment, hardwareList} = req.body.params
        console.log(hardwareList)
        console.log(JSON.stringify(hardwareList))
        await pool.query(`
            INSERT INTO requirement(date, type_material_assets, contractor, an_invoice_for_payment, shipping_document, comment)
            VALUES('${date}', '${typeMaterialAssets}', '${contractor}', '${anInvoiceForPayment}', '${shippingDocument}', '${comment}')
            RETURNING id
        `).then(async (result) => {
            if (hardwareList.length > 0) {
                console.log('asd')
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
        await pool.query(`
            select * from requirement;
        `).then((result) => {
            res.json(result.rows)
        }).catch((error) => {
            console.log(`${error}`)
        })
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