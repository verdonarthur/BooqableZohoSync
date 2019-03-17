const Customer = require('../model/Customer')

const Sync = require('./Sync')
const SYSTEM = { ZOHO: 1, BOOQABLE: 2 }

module.exports = class CustomerSync extends Sync {
    constructor() {
        super()
    }

    static get SYSTEM() { return SYSTEM }

    /**
     * Will sync local customer database with zoho latest change
     */
    async syncFromZoho() {
        try {
            let zohoCustomers = await Customer.getAllFromZoho()

            for (let zohoCustomer of zohoCustomers) {
                let customer = Customer.fromZoho(zohoCustomer)
                let isInDB = await Customer.findByZohoID(zohoCustomer.contact_id)

                if (isInDB) {
                    let lastUpdateZoho = new Date(customer.zohoLastUpdate)
                    let lastUpdateDB = new Date(isInDB.createdAt)

                    if (lastUpdateDB < lastUpdateZoho) {
                        isInDB.email = customer.email
                        isInDB.displayName = customer.displayName
                        isInDB.zohoLastUpdate = lastUpdateZoho

                        await isInDB.save()
                        console.log('update : ', customer)

                    } else { console.log('latest change already sync') }
                } else {
                    await customer.save()

                    console.log('add new : ', customer)
                }

            }
        } catch (err) {
            console.log(err);
            return err
        }
    }

    /**
     * Sync customer change to Zoho
     */
    async syncToZoho() {
        let localDBCustomers = await Customer.find()

        for (localCustomer of localDBCustomers) {
            await localCustomer.saveToZoho()
        }
    }

    /**
     * Sync customer from booqable to local db
     */
    async syncFromBooqable() {
        try {
            let booqableCustomers = await Customer.getAllFromBooqable()

            for (let booqableCustomer of booqableCustomers) {
                let customer = Customer.fromBooqable(booqableCustomer)
                let isInDB = await Customer.findByBooqableID(booqableCustomer.id)
                console.log("before save")
                if (isInDB) {
                    let lastUpdateBooqable = new Date(customer.booqableLastUpdate)
                    let lastUpdateDB = new Date(isInDB.createdAt)

                    if (lastUpdateDB < lastUpdateBooqable) {
                        isInDB.email = customer.email
                        isInDB.displayName = customer.displayName
                        isInDB.booqableLastUpdate = lastUpdateBooqable

                        await isInDB.save()
                        console.log('update : ', customer)
                    } else { console.log('latest change already sync') }
                } else {
                    await customer.save()
                    console.log('add new : ', customer)
                }
            }
        } catch (err) {
            console.log(err)
            return err
        }
    }

    /**
     * Will sync local customer database to booqable
     */
    async syncToBooqable() {
        let localDBCustomers = await Customer.find()

        for (let localCustomer of localDBCustomers) {
            await localCustomer.saveToBooqable()
        }
    }

    /**
     * Will sync booqable and zoho, the priority define who's the first to be sync
     * @param {*} priority 
     */
    async completeSync(priority) {
        try {
            switch (priority) {
                case SYSTEM.ZOHO:
                    await this.syncFromZoho()
                    await this.syncToBooqable()
                    break;

                case SYSTEM.BOOQABLE:
                    await this.syncFromBooqable()
                    await this.syncToZoho()
                    break;

                default:
                    break;
            }
        } catch (err) {
            console.log(err)
            return err
        }

    }
}