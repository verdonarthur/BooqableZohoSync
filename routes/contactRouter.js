const express = require('express')
const router = express.Router()

const Customer = require('../class/Customer')

const Zoho = require('../class/Zoho')
let zoho = new Zoho()

const Booqable = require('../class/Booqable')
let booqable = new Booqable()


router.get('/getFromZoho', async (req, res, next) => {
    let contacts = await zoho.getAllContact()
    res.send(contacts)


})

router.get('/getFromBooqable', async (req, res, next) => {
    let contacts = await booqable.getAllCustomers()
    res.send(contacts)


})

router.get('/flushBooqable', async (req, res, next) => {
    let customers = await booqable.getAllCustomers()
    let msg = []
    customers.forEach(async customer => {
        msg.push(await booqable.removeACustomer(customer.id))
    })

    res.send(msg)
})

router.get('/syncFromZoho', async (req, res, next) => {
    let contacts = await zoho.getAllContact()

    contacts.forEach(async contact => {
        let newCustomer = Customer.newFromZoho(contact)
        console.log(newCustomer.getForBooqable())
        booqable.saveACustomer(newCustomer.getForBooqable())
    });

    let customers = await booqable.getAllCustomers()

    res.send(customers)

})

module.exports = router