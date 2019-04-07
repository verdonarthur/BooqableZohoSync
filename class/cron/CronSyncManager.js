const CronJob = require('cron').CronJob;
const Utils = require('../utils/Utils')
const logger = require('../utils/Logger')

module.exports = class CronSyncMangager {
    constructor(address, port) {
        this.LOCAL_API_ADDRESS = `${address}:${port}`
        this.cronSyncCustomers('*/1 6-19 * * 1-6') // At every 1 minute past every hour from 6 through 19 on every day-of-week from Monday through Saturday.
        this.cronSyncProducts('0 6-19 * * 1-6') // At minute 0 past every hour from 6 through 19 on every day-of-week from Monday through Saturday. 
        this.cronSyncInvoices('0 6-19 * * 1-6') // At minute 0 past every hour from 6 through 19 on every day-of-week from Monday through Saturday.
    }

    /**
     * Global sync function
     * @param {*} cronPattern 
     * @param {*} urlForSync 
     */
    cronSync(cronPattern, urlForSync) {
        new CronJob(cronPattern, function () {
            Utils.request('GET', urlForSync)
                .catch((e) => logger.info(JSON.stringify(e)))
        }).start();
    }

    /**
     * Launch cron job for customer
     * @param {*} cronPattern 
     */
    cronSyncCustomers(cronPattern) {
        this.cronSync(cronPattern, `${this.LOCAL_API_ADDRESS}/customer/sync`)
    }
    /**
     * Launch cron job for product
     * @param {*} cronPattern 
     */
    cronSyncProducts(cronPattern) {
        this.cronSync(cronPattern, `${this.LOCAL_API_ADDRESS}/product/sync`)
    }
    /**
     * Launch cron job for invoice
     * @param {*} cronPattern 
     */
    cronSyncInvoices(cronPattern) {
        this.cronSync(cronPattern, `${this.LOCAL_API_ADDRESS}/invoice/exportInvoiceToZoho`)
    }
}