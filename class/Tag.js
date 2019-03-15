const config = require('../config/config')
const fetch = require('node-fetch')

module.exports = class Tags {
    static URL() { return config.booqable_api_address + "tags/" }
    static HEADERS() { return { 'Content-Type': 'application/json' } }


    constructor(content) {
        this.content = content
    }

    async saveCustomerTag(idCustomer) {
        
        try {
            await fetch(`${Tags.URL()}add.json?api_key=${config.booqable_api_key}`, {
                method: 'POST',
                headers: Tags.HEADERS(),
                body: JSON.stringify({ "name": this.content, customer_id: idCustomer })
            })
            

        } catch (e) {
            console.log(e)
        }
    }

    static saveCustomerTag(idCustomer, tag) {
        tag.saveCustomerTag(idCustomer)
    }


}