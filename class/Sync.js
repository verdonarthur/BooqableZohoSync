const mergedContact = require('../exampleData/mergedContact')
const Customer = require('../class/Customer')
const Zoho = require('../class/Zoho')
const Booqable = require('../class/Booqable')
const Tag = require('../class/Tag')


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
            case Sync.ZOHO():
                this.syncContactFromZoho()
                break
            case Sync.BOOQABLE():
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
            //let booqableCustomer = booqableCustomers.find(ele => { return ele.tags.find(ele2 => { return ele2.search("ZOHOID") != -1 }) == contact.id })
            this.syncContact(contact, booqableCustomer, Sync.ZOHO())
        })

    }

    /**
     * 
     * @param {*} primaryContact 
     * @param {*} secondaryContact 
     * @param {*} whichSystemIsPrimary 
     */
    static async syncContact(primaryContact, secondaryContact, whichSystemIsPrimary = Sync.ZOHO()) {
        switch (whichSystemIsPrimary) {
            case Sync.ZOHO():
                // is a new Contact
                if (secondaryContact == null) {
                    let newCustomer = Customer.newFromZoho(primaryContact)
                    newCustomer = await booqable.saveANewCustomer(newCustomer.translateForBooqable())

                    //Tag.saveCustomerTag(newCustomer.id, new Tag(`ZOHOID=${primaryContact.id}`))
                } else {
                    let customerToUpdate = Customer.newFromZoho(primaryContact)

                    await booqable.updateACustomer(secondaryContact.id, customerToUpdate.translateForBooqable())
                    
                    //Tag.saveCustomerTag(secondaryContact.id, new Tag(`ZOHOID=${primaryContact[mergedContact.zoho.id]}`))
                }
                break
            case Sync.BOOQABLE():
                break
        }

    }
}