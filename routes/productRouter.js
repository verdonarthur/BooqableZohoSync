const express = require('express')
const router = express.Router()
const ProductSync = require('../class/sync/ProductSync')
const Product = require('../class/model/Product')
const logger = require('../class/utils/Logger')

router.get('/flushBooqable', async (req, res, next) => {
    /*let customers = await booqable.getAllCustomers()
    let msg = []
    customers.forEach(async customer => {
        msg.push(await booqable.removeACustomer(customer.id))
    })

    res.send(msg)*/
})


router.get('/', async (req, res, next) => {
    try {
        res.send(await Product.find())
    } catch (e) {
        res.sendStatus('500').send(e)
        logger.error(e)
    }
})

router.get('/sync', async (req, res, next) => {
    try {
        let productSync = new ProductSync()
        let data = await productSync.completeSync(ProductSync.SYSTEM.ZOHO)
        res.sendStatus(200).send(JSON.stringify(data))
    } catch (e) {
        res.sendStatus(500).send(e)
        logger.error(e)
    }

})


router.get('/sync/:system', async (req, res, next) => {
    try {
        let productSync = new ProductSync()
        let data = { syncFrom: null, syncTo: null }
        switch (req.params.system) {
            case "zoho":
                data.syncFrom = await productSync.syncFromZoho()
                data.syncTo = await productSync.syncToBooqable()
                break;
            case "booqable":
                data.syncFrom = await productSync.syncFromBooqable()
                data.syncTo = await productSync.syncToZoho()
                break;
            default:
            break;
        }
        res.send(JSON.stringify(data))

    } catch (e) {
        res.sendStatus(500).send(e)
        logger.error(e)
    }
})

module.exports = router