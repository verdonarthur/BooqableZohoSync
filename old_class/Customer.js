const mergedContact = require('../exampleData/mergedContact')
const Address = require('./Address')

/**
 * https://stackoverflow.com/questions/4244896/dynamically-access-object-property-using-variable
 * @param {*} path 
 * @param {*} obj 
 */
function resolve(path, obj) {
    return path.split('.').reduce(function (prev, curr) {
        return prev ? prev[curr] : null
    }, obj)
}


module.exports = class Customer {
    constructor(id, name, email, phone, billing, shipping) {
        this.id = id
        this.name = name
        this.email = email
        this.phone = phone
        this.billing = billing
        this.shipping = shipping
    }

    /**
     * 
     * @param {*} zohoContact 
     */
    static newFromZoho(zohoContact) {
        return new Customer(
            resolve(mergedContact.zoho.id, zohoContact),
            resolve(mergedContact.zoho.name, zohoContact),
            resolve(mergedContact.zoho.email, zohoContact),
            resolve(mergedContact.zoho.mobilePhone, zohoContact) != '' ? resolve(mergedContact.zoho.mobilePhone, zohoContact) : resolve(mergedContact.zoho.phone, zohoContact),
            new Address(
                resolve(mergedContact.zoho.billing.address),
                resolve(mergedContact.zoho.billing.zipcode),
                resolve(mergedContact.zoho.billing.city),
                resolve(mergedContact.zoho.shipping.region),
                resolve(mergedContact.zoho.billing.country),
            ),
            new Address(
                resolve(mergedContact.zoho.shipping.address),
                resolve(mergedContact.zoho.shipping.zipcode),
                resolve(mergedContact.zoho.shipping.city),
                resolve(mergedContact.zoho.shipping.region),
                resolve(mergedContact.zoho.shipping.country),
            ),
        )
    }

    /**
     * 
     */
    translateForBooqable() {
        let booqableCustomer = {}

        booqableCustomer[mergedContact.booqable.name] = this.name
        booqableCustomer[mergedContact.booqable.email] = this.email
        booqableCustomer[mergedContact.booqable.phone] = this.phone
        booqableCustomer.properties_attributes = [
            this.billing.translateToBooqableAddress("Billing"),
            this.shipping.translateToBooqableAddress("Shipping")]

        return booqableCustomer
    }
}