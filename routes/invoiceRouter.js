const express = require('express')
const Invoice = require('../class/model/Invoice')
const router = express.Router()


router.get('/exportInvoiceToZoho', async (req, res, next) => {
    try {
        console.log('------------------ saving invoice to local db ------------------')
        await Invoice.saveBooqableOrderToLocalDB()

        console.log('------------------ finding new invoice to save to zoho ------------------')
        let invoices = await Invoice.find()
        console.log(invoices)
        for (const invoice of invoices) {
            invoice.saveToZoho()
        }

        res.send('')
    } catch (err) {
        console.log(err)
        res.send({ error: err })
    }

})

module.exports = router