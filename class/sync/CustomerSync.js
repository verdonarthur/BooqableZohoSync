const Sync = require('./Sync')
const Customer = require('../model/Customer')

module.exports = class CustomerSync extends Sync {
    constructor() {
        super()
    }

    /**
     * Will sync local customer database with zoho latest change
     */
    async syncFromZoho() {
        return await super.syncFromZoho(Customer)
    }

    /**
     * Sync customer change to Zoho
     */
    async syncToZoho() {
        return await super.syncToZoho(Customer)
    }

    /**
     * Sync customer from booqable to local db
     */
    async syncFromBooqable() {      
        return await super.syncFromBooqable(Customer)
    }

    /**
     * Will sync local customer database to booqable
     */
    async syncToBooqable() {        
        return await super.syncToBooqable(Customer)
    }
}