const express = require('express')
const ProductSync = require('../class/sync/ProductSync')
const router = express.Router()


router.get('/getFromZoho', async (req, res, next) => {
    
})

router.get('/getFromBooqable', async (req, res, next) => {
    
})

router.get('/flushBooqable', async (req, res, next) => {
    /*let customers = await booqable.getAllCustomers()
    let msg = []
    customers.forEach(async customer => {
        msg.push(await booqable.removeACustomer(customer.id))
    })

    res.send(msg)*/
})

router.get('/syncFromZoho', async (req, res, next) => {
    let productSync = new ProductSync()
    
    let data = await productSync.completeSync(ProductSync.SYSTEM.ZOHO)
    
    res.send(JSON.stringify(data))
})

module.exports = router