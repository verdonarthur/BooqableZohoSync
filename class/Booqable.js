const fetch = require('node-fetch');

const config = require('../config/config')

module.exports = class Booqable {
    constructor() {
        this.API_ADDRESS = config.booqable_api_address
        this.APIKEY = config.booqable_api_key

        this.HEADERS = { 'Content-Type': 'application/json' /*,"Authorization": `Zoho-authtoken ${this.AUTHTOKEN}`*/ }
    }

    async getAllCustomers() {
        try {
            let res = await fetch(`${this.API_ADDRESS}customers?api_key=${this.APIKEY}`, {
                method: 'GET',
                headers: this.HEADERS,
            })
            res = await res.json()
            return res.customers
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async saveANewCustomer(customer) {
        try {
            let res = await fetch(`${this.API_ADDRESS}customers?api_key=${this.APIKEY}`, {
                method: 'POST',
                headers: this.HEADERS,
                body: { customer: JSON.stringify(customer) }
            })
            return await res.json()
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async updateACustomer(id, customer) {
        try {
            let res = await fetch(`${this.API_ADDRESS}customers/${customer.id}?api_key=${this.APIKEY}`, {
                method: 'PUT',
                headers: this.HEADERS,
                body: { customer: JSON.stringify(customer) }
            })
            return await res.json()
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async removeACustomer(id) {
        try {
            let res = await fetch(`${this.API_ADDRESS}customers/${id}/archive?api_key=${this.APIKEY}`, {
                method: 'DELETE',
                headers: this.HEADERS
            })
            return await res.json()
        } catch (e) {
            console.log(e)
            return null
        }
    }
}