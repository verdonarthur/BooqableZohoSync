const mergedContact = require('../exampleData/mergedContact')


module.exports = class Customer{
    constructor(id,name,email,phone){
        this.id = id
        this.name = name
        this.email = email
        this.phone = phone
    }

    static newFromZoho(zohoContact){
        return new Customer(
            zohoContact[mergedContact.zoho.id],
            zohoContact[mergedContact.zoho.name],
            zohoContact[mergedContact.zoho.email],
            zohoContact[mergedContact.zoho.phone])
    }

    getForBooqable(){
        let zohpIdFieldName = mergedContact.zoho.id
        let booqableCustomer = {}
        booqableCustomer.properties = [{zohpIdFieldName:this.id}]
        booqableCustomer[mergedContact.booqable.name] = this.name
        booqableCustomer[mergedContact.booqable.email] = this.email
        booqableCustomer[mergedContact.booqable.phone] = this.phone

        return booqableCustomer
    }
}