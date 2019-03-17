const express = require('express')
const CustomerSync = require('../class/sync/CustomerSync')
const router = express.Router()


router.get('/getFromZoho', async (req, res, next) => {
    /*let contacts = await zoho.getAllContact()
    res.send(contacts)*/
})

router.get('/getFromBooqable', async (req, res, next) => {
    /*let contacts = await booqable.getAllCustomers()
    res.send(contacts)*/
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
    let customerSync = new CustomerSync()
    
    customerSync.completeSync(CustomerSync.SYSTEM.ZOHO)
    

    res.send('')
})

module.exports = router