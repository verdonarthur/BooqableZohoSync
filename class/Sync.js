const mergedContact = require('../exampleData/mergedContact')
const Customer = require('../class/Customer')
const Zoho = require('../class/Zoho')
const Booqable = require('../class/Booqable')

let zoho = new Zoho()
let booqable = new Booqable()

/**
 * 
 */
module.exports = class Sync {
    static ZOHO() { return 1 }
    static BOOQABLE() { return 2 }

    /**
     * 
     * @param {*} system 
     */
    static syncContactFrom(system) {
        switch (system) {
            case this.ZOHO:
                this.syncContactFromZoho()
                break
            case this.BOOQABLE:
                break
        }
    }

    /**
     * 
     */
    static async syncContactFromZoho() {
        let zohoContacts = await zoho.getAllContact()
        let booqableCustomers = await booqable.getAllCustomers()

        zohoContacts.forEach(contact => {
            let booqableCustomer = booqableCustomers.find(ele => { return ele[mergedContact.booqable.email] == contact.email })
            this.syncContact(contact, booqableCustomer, this.ZOHO)
        })

    }

    /**
     * 
     * @param {*} primaryContact 
     * @param {*} secondaryContact 
     * @param {*} whichSystemIsPrimary 
     */
    static async syncContact(primaryContact, secondaryContact, whichSystemIsPrimary = this.ZOHO) {
        switch (whichSystemIsPrimary) {
            case this.ZOHO:
                // is a new Contact
                if (secondaryContact == null) {
                    let newCustomer = Customer.newFromZoho(primaryContact)
                    await booqable.saveANewCustomer(newCustomer.translateForBooqable())
                } else {
                    let customerToUpdate = Customer.newFromZoho(primaryContact)
                    await booqable.updateACustomer(secondaryContact.id, customerToUpdate.translateForBooqable())
                }
                break
            case this.BOOQABLE:
                break
        }

    }
}