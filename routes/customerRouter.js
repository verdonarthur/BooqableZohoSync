const express = require('express')
const router = express.Router()

const CustomerSync = require('../class/sync/CustomerSync')
const Customer = require('../class/model/Customer')
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
        res.send(await Customer.find())
    } catch (e) {
        res.status(500).send(e)
        logger.error(e)
    }
})

router.get('/sync', async (req, res, next) => {
    try {
        let customerSync = new CustomerSync()
        await customerSync.completeSync(CustomerSync.SYSTEM.ZOHO)
        res.send({})
    } catch (e) {
        res.status(500).send(e)
        logger.error(e)
    }
})

router.get('/sync/:system', async (req, res, next) => {
    try {
        let customerSync = new CustomerSync()
        let data = { syncFrom: null, syncTo: null }
        switch (req.params.system) {
            case "zoho":
                data.syncFrom = await customerSync.syncFromZoho()
                data.syncTo = await customerSync.syncToBooqable()
                break;
            case "booqable":
                data.syncFrom = await customerSync.syncFromBooqable()
                data.syncTo = await customerSync.syncToZoho()
                break;
            default:
            break;
        }
        res.send(JSON.stringify(data))

    } catch (e) {
        res.status(500).send(e)
        logger.error(e)
    }
})

module.exports = router