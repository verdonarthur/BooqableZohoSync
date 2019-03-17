const Sync = require('./Sync')
const Product = require('../model/Product')

module.exports = class ProductSync extends Sync {
    constructor() {
        super()
    }
    
    /**
     * Will sync local Product database with zoho latest change
     */
    async syncFromZoho() {
        return await super.syncFromZoho(Product)
    }

    /**
     * Sync Product change to Zoho
     */
    async syncToZoho() {
        return await super.syncToZoho(Product)
    }

    /**
     * Sync Product from booqable to local db
     */
    async syncFromBooqable() {      
        return await super.syncFromBooqable(Product)
    }

    /**
     * Will sync local Product database to booqable
     */
    async syncToBooqable() {        
        return await super.syncToBooqable(Product)
    }
}