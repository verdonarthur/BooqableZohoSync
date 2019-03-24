const express = require('express')
const router = express.Router()
const Invoice = require('../class/model/Invoice')
const logger = require('../class/utils/Logger')

router.get('/', async (req, res, next) => {
    try {
        res.send(await Invoice.find())
    } catch (e) {
        res.sendStatus('500').send(e)
        logger.error(JSON.stringify(e))
    }
})

router.get('/exportInvoiceToZoho', async (req, res, next) => {
    try {
        logger.info('saving invoice to local db')
        await Invoice.saveBooqableOrderToLocalDB()

        logger.info('------------------ finding new invoice to save to zoho ------------------')
        let invoices = await Invoice.find()
        logger.info(invoices)
        for (const invoice of invoices) {
            invoice.saveToZoho()
            logger.info('new invoice save to zoho' + JSON.stringify(invoice))
        }

        res.status(200).send({ msg: "OK" })
    } catch (err) {
        logger.error(err)
        res.send({ error: err })
    }

})

module.exports = router