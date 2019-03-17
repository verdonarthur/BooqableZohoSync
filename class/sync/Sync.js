const Customer = require('../model/Customer')


const SYSTEM = { ZOHO: 1, BOOQABLE: 2 }

module.exports = class Sync {
    constructor() {
    }

    /**
     * Will sync local database with zoho latest change
     */
    syncFromZoho() { }

    /**
     * sync local change to zoho
     */
    syncToZoho() { }

    /**
     * sync local change from booqable latest change
     */
    syncFromBooqable() { }

    /**
     * sync local change to booqable
     */
    syncToBooqable() { }

    /**
     * 
     * @param {*} priority 
     */
    completeSync(priority) { }
}