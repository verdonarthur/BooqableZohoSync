const mongoose = require('mongoose')
const Zoho = require('../utils/Zoho')
const Booqable = require('../utils/Booqable')

// ------------------------------------------ ADDRESS SCHEMA -------------------------------------------------

let addressSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    street1: {
        type: String
    },
    street2: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    zipcode: {
        type: Number
    },
    country: {
        type: String
    }
}, { _id: false })
// ------------------------------------------ STATICS METHODS -------------------------------------------------

/**
 * convert a zoho address to a local db address
 * @param {*} zohoAddress 
 */
addressSchema.statics.fromZoho = function (zohoAddress) {
    return new Address({
        firstName: "",
        lastName: zohoAddress.attention,
        street1: zohoAddress.address,
        street2: zohoAddress.street2,
        city: zohoAddress.city,
        state: zohoAddress.state,
        zipcode: zohoAddress.zip,
        country: zohoAddress.country
    })
}

/**
 * convert a booqable address to a local db address
 * @param {*} zohoAddress 
 */
addressSchema.statics.fromBooqable = function (booqableAddress) {
    return new Address({
        firstName: booqableAddress.first_name,
        lastName: booqableAddress.last_name,
        street1: booqableAddress.address1,
        street2: booqableAddress.address2,
        city: booqableAddress.city,
        state: booqableAddress.region,
        zipcode: booqableAddress.zipcode,
        country: booqableAddress.country
    })
}

// ------------------------------------------ METHODS -------------------------------------------------

const Address = mongoose.model('Address', addressSchema)

// ------------------------------------------ CUSTOMER SCHEMA -------------------------------------------------

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
    billingAddress: {
        type: addressSchema
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
customerSchema.statics.fromZoho = async function (zohoContact) {
    let zohoID = zohoContact.contact_id
    let zohoName = zohoContact.contact_name
    let zohoEmail = zohoContact.email
    let zohoLastUpdate = zohoContact.last_modified_time

    try {
        let zoho = new Zoho()
        let fetchedZohoContact = (await zoho.fetchOne('contacts', zohoID)).contact
        billingAddress = Address.fromZoho(fetchedZohoContact.billing_address)
        return new Customer({ displayName: zohoName, email: zohoEmail, zohoID: zohoID, zohoLastUpdate: zohoLastUpdate, billingAddress: billingAddress })
    } catch (e) {
        return new Customer({ displayName: zohoName, email: zohoEmail, zohoID: zohoID, zohoLastUpdate: zohoLastUpdate, billingAddress: {} })
    }
}

/**
 * Will create or update a customer by a booqable customer
 * 
 * @param {*} booqableCustomer
 */
customerSchema.statics.fromBooqable = async function (booqableCustomer) {
    let booqableID = booqableCustomer.id
    let booqableDisplayName = booqableCustomer.name
    let booqableEmail = booqableCustomer.email
    let booqableLastUpdate = booqableCustomer.updated_at

    try {
        let booqable = new Booqable()
        let fetchedBooqableContact = (await booqable.fetchOne('customers', booqableID)).customer
        billingAddress = Address.fromBooqable(fetchedBooqableContact.properties.find((ele) => { return ele.type == "Property::Address" && ele.name == "Main" }))
        return new Customer({ displayName: booqableDisplayName, email: booqableEmail, booqableID: booqableID, booqableLastUpdate: booqableLastUpdate, billingAddress: billingAddress })
    } catch (e) {
        return new Customer({ displayName: booqableDisplayName, email: booqableEmail, booqableID: booqableID, booqableLastUpdate: booqableLastUpdate, billingAddress: {} })
    }
}

// ------------------------------------------ METHODS -------------------------------------------------

/**
 * Will set the field to sync on the current record
 */
customerSchema.methods.setFieldToSync = function (customer) {
    this.email = customer.email
    this.displayName = customer.displayName
    this.billingAddress = customer.billingAddress
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
        email: this.email,
        properties_attributes: [
            {
                type: "Property::Address",
                name: "Main",
                first_name: this.billingAddress.firstName,
                last_name: this.billingAddress.lastName,
                address1: this.billingAddress.street1,
                address2: this.billingAddress.street2,
                zipcode: this.billingAddress.zipcode,
                city: this.billingAddress.city,
                region: this.billingAddress.state,
                country: this.billingAddress.country
            }
        ]
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
        billing_address: {
            attention: this.billingAddress.lastName,
            address: this.billingAddress.street1,
            street2: this.billingAddress.street2,
            zip: this.billingAddress.zipcode,
            city: this.billingAddress.city,
            state: this.billingAddress.state,
            country: this.billingAddress.country
        }
    }
    try {        
        // if contact exist already on zoho
        if (this.zohoID) {

            // if email is same, remove it to prevent error 102027 during update
            let fetchedZohoCustomer = (await zoho.fetchOne('contacts', this.zohoID)).contact
            if(zohoCustomer.contact_persons[0].email == fetchedZohoCustomer.email){
                delete zohoCustomer.contact_persons
            }

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