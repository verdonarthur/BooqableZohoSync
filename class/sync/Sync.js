const Customer = require('../model/Customer')


const SYSTEM = { ZOHO: 1, BOOQABLE: 2 }

module.exports = class Sync {
    constructor() {
    }

    /**
     * Will sync local database and booqable with zoho latest change
     */
    async syncFromZoho() {
        let zohoCustomers = await Customer.getAllFromZoho()
        console.log(zohoCustomers)
        zohoCustomers.forEach(zohoCustomer => {
            let isInDB = Customer.findByZohoID(zohoCustomer.contact_id)
            console.log(isInDB)
            if (isInDB){//&& last update date is more recebt on zoho ) 
                //isInDB.update
                console.log('update')
            }else{
                console.log('add new')
            }
        });

        // TODO SYNC ON BOOQABLE

    }

    syncFromBooqable() { }

    completeSync(priority) { }
}