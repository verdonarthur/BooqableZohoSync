const mongoose = require('mongoose')
const Zoho = require('../utils/Zoho')
const Booqable = require('../utils/Booqable')

let customerSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    booqableID: {
        type: String,
        unique: true,
        sparse: true
    },
    zohoID: {
        type: String,
        unique: true,
        sparse: true
    },
    booqableLastUpdate: {
        type: Date,
    },
    zohoLastUpdate: {
        type: Date,
    }
}, { timestamps: true })

// ------------------------------------------ STATICS METHODS -------------------------------------------------


/**
 * Return all contacts from zoho
 */
customerSchema.statics.getAllFromZoho = async function () {
    let zoho = new Zoho()
    let contacts = []
    let res = {}
    let indexPage = 1
    do {
        res = await zoho.fetch('contacts', { page: indexPage })
        contacts = contacts.concat(res.contacts)
        indexPage++
    } while (res.page_context && res.page_context.has_more_page)
    
    return contacts
}

/**
 * get all customer from booqable
 */
customerSchema.statics.getAllFromBooqable = async function () {
    let booqable = new Booqable()
    let res = await booqable.fetch('customers')
    return res.customers
}

/**
 * Find a record by the zoho id
 * @param {*} zohoID
 */
customerSchema.statics.findByZohoID = async function (zohoID) {
    return await this.findOne({ zohoID: zohoID })
}

/**
 * Find a record by the booqable id
 * @param {*} zohoID
 */
customerSchema.statics.findByBooqableID = async function (booqableID) {
    return await this.findOne({ booqableID: booqableID })
}

/**
 * Will create or update a customer by a zoho contact
 * 
 * @param {*} zohoContact
 */
customerSchema.statics.fromZoho = function (zohoContact) {
    let zohoID = zohoContact.contact_id
    let zohoName = zohoContact.contact_name
    let zohoEmail = zohoContact.email
    let zohoLastUpdate = zohoContact.last_modified_time

    return new Customer({ displayName: zohoName, email: zohoEmail, zohoID: zohoID, zohoLastUpdate: zohoLastUpdate })
}

/**
 * Will create or update a customer by a booqable customer
 * 
 * @param {*} booqableCustomer
 */
customerSchema.statics.fromBooqable = function (booqableCustomer) {
    let booqableID = booqableCustomer.id
    let booqableDisplayName = booqableCustomer.name
    let booqableEmail = booqableCustomer.email
    let booqableLastUpdate = booqableCustomer.updated_at

    return new Customer({ displayName: booqableDisplayName, email: booqableEmail, booqableID: booqableID, booqableLastUpdate: booqableLastUpdate })
}

// ------------------------------------------ METHODS -------------------------------------------------

/**
 * Will set the field to sync on the current record
 */
customerSchema.methods.setFieldToSync = function (customer) {
    this.email = customer.email
    this.displayName = customer.displayName
    if (customer.zohoLastUpdate) {
        this.zohoLastUpdate = new Date(customer.zohoLastUpdate)
    }
    else {
        this.booqableLastUpdate = new Date(customer.booqableLastUpdate)
    }

}

/**
 * Will save or update the record to booqable
 */
customerSchema.methods.saveToBooqable = async function () {
    let booqable = new Booqable()

    let booqableCustomer = {
        name: this.displayName,
        email: this.email
    }

    try {
        // if contact exist already on booqable
        if (this.booqableID) {
            return await booqable.update('customers', this.booqableID, { customer: booqableCustomer })
        } else {
            let res = await booqable.create('customers', booqableCustomer)
            this.booqableID = res.customer.id
            this.booqableLastUpdate = res.customer.updated_at
            return await this.save()

        }
    } catch (err) {
        return Promise.reject({ error: err })
    }
}

/**
 * Will save or update the record to zoho
 */
customerSchema.methods.saveToZoho = async function () {
    let zoho = new Zoho()

    let zohoCustomer = {
        contact_name: this.displayName,
        contact_type: "customer",
        contact_persons: [
            {
                email: this.email
            }],
    }
    try {
        // if contact exist already on zoho
        if (this.zohoID) {
            let res = await zoho.update('contacts', this.zohoID, zohoCustomer)

            // code 102027 is for same email check
            if (res.code != 0 && res.code != 102027) {
                throw new Error(JSON.stringify(res))
            }
            return res
        } else {
            let res = await zoho.create('contacts', zohoCustomer)
            if (res.code != 0) {
                throw new Error(JSON.stringify(res))
            } else {
                this.zohoID = res.contact.contact_id
                this.zohoLastUpdate = res.contact.last_modified_time
                return await this.save()
            }

        }
    } catch (err) {
        return Promise.reject({ error: err })
    }
}

const Customer = mongoose.model('Customer', customerSchema)
module.exports = Customer