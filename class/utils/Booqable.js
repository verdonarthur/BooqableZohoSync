const fetch = require('node-fetch');

const config = require('../../config/generatedConfig')

/**
 * 
 */
module.exports = class Booqable {
    constructor() {
        this.API_ADDRESS = config.booqable_api_address
        this.APIKEY = config.booqable_api_key

        this.HEADERS = { 'Content-Type': 'application/json' }
    }

    /**
     * Default request methode
     * @param {*} method 
     * @param {*} url 
     */
    async request(method, url, body = JSON.stringify({})) {
        try {
            let res
            if (method === 'GET') {
                res = await fetch(url, {
                    method: method,
                    headers: this.HEADERS
                })
            } else {
                res = await fetch(url, {
                    method: method,
                    headers: this.HEADERS,
                    body: body
                })
            }

            return await res.json()
        }
        catch (e) {
            return Promise.reject({ error: e })
        }
    }

    /**
     * return all record From Booqable by the type in param
     * @param {*} type 
     */
    async fetch(type) {
        return await this.request('GET', `${this.API_ADDRESS}${type}?api_key=${this.APIKEY}`)
    }

    /**
     * return one record From booqable by the type and id in param
     * @param {*} type 
     * @param {*} id
     */
    async fetchOne(type, id) {
        return await this.request('GET', `${this.API_ADDRESS}${type}/${id}?api_key=${this.APIKEY}`)
    }

    /**
     * create a record to booqable
     * @param {*} type 
     */
    async create(type, object) {
        return await this.request('POST', `${this.API_ADDRESS}${type}?api_key=${this.APIKEY}`, JSON.stringify(object))
    }

    /**
     * update a record to booqable
     * @param {*} type 
     */
    async update(type, id, object) {
        return await this.request('PUT', `${this.API_ADDRESS}${type}/${id}?api_key=${this.APIKEY}`, JSON.stringify(object))
    }

    /**
     * will delete a record in booqable
     * @param {*} type 
     * @param {*} id 
     */
    async delete(type, id) {
        return await this.request('DELETE', `${this.API_ADDRESS}${type}/${id}/archive?api_key=${this.APIKEY}`)
    }

    /**
     * A special post request mainly used for managing order status
     * @param {*} type 
     * @param {*} id 
     * @param {*} action 
     */
    async specialPostRequest(type, id, action) {
        return await this.request('POST', `${this.API_ADDRESS}${type}/${id}/${action}?api_key=${this.APIKEY}`)
    }
}