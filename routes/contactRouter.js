const express = require('express')
const router = express.Router()

const mergedContact = require('../exampleData/mergedContact')

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
    let newContacts = []
    let contactToUpdate = []

    let zohoContacts = await zoho.getAllContact()
    let booqableCustomers = await booqable.getAllCustomers()

    zohoContacts.forEach(contact => {
        booqableCustomer = booqableCustomers.find(ele => { return ele[mergedContact.booqable.email] == contact.email })
        if (booqableCustomer == null) {
            newContacts.push(Customer.newFromZoho(contact))
        } else {
            let customerToUpdate = Customer.newFromZoho(contact)
            customerToUpdate.id = booqableCustomer.id
            contactToUpdate.push(customerToUpdate)
        }
    })

    console.log("------------NEW CONTACT-------\n", newContacts)
    console.log("------------UPDATE CONTACT-------\n", contactToUpdate)


    newContacts.forEach(async contact => {
        await booqable.saveACustomer(contact.translateForBooqable()) // await to not have same number in booqable
    });

    let customers = await booqable.getAllCustomers()

    res.send(customers)

})

module.exports = router