const Customer = require('../Customer')
const Booqable = require('./Booqable')
const fetch = require('node-fetch');

const BOOQABLE = new Booqable()

module.exports = class BooqableCustomer extends Customer{

    /**
     * 
     * @param {*} id 
     * @param {*} name 
     * @param {*} email 
     */
    constructor(id,name,email){
        super(id,name,email,null,null,null)
    }

    static CUSTOMER_GET_URL(BOOQABLE = BOOQABLE){
        return `${BOOQABLE.API_ADDRESS}customers?api_key=${BOOQABLE.APIKEY}`
    }

    static CUSTOMER_POST_URL(BOOQABLE = BOOQABLE, id){
        return `${BOOQABLE.API_ADDRESS}customers/${id}?api_key=${BOOQABLE.APIKEY}`
    }

    /**
     * 
     */
    static async getAllCustomers() {
        try {
            let res = await fetch(`${BOOQABLE.API_ADDRESS}customers?api_key=${this.BOOQABLE.APIKEY}`, {
                method: 'GET',
                headers: this.BOOQABLE.HEADERS,
            })
            res = await res.json()
            return res.customers
        } catch (e) {
            console.log(e)
            return null
        }
    }

    /**
     * 
     * @param {*} customer 
     */
    async saveANewCustomer(customer) {
        try {
            let res = await fetch(`${this.BOOQABLE.API_ADDRESS}customers?api_key=${this.BOOQABLE.APIKEY}`, {
                method: 'POST',
                headers: this.HEADERS,
                body: JSON.stringify(customer)
            })
            return await res.json()
        } catch (e) {
            console.log(e)
            return null
        }
    }

    /**
     * 
     * @param {*} id 
     * @param {*} customer 
     */
    async updateACustomer(id, customer) {
        try {
            let res = await fetch(`${this.API_ADDRESS}customers/${id}?api_key=${this.APIKEY}`, {
                method: 'PUT',
                headers: this.HEADERS,
                body: JSON.stringify({ customer: customer })
            })
            return await res.json()
        } catch (e) {
            console.log(e)
            return null
        }
    }

    /**
     * 
     * @param {*} id 
     */
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