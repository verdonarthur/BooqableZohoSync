const fetch = require('node-fetch');
const FormData = require('form-data');
const Util = require('./Utils')

const config = require('../../config/generatedConfig')

/**
 * 
 */
module.exports = class Zoho {
    constructor() {
        this.API_ADDRESS = config.zoho_api_address
        this.AUTHTOKEN = config.zoho_books_authtoken
        this.ORGANISATION_ID = config.zoho_organisation_id
        this.HEADERS = { 'Content-Type': 'application/json', "Authorization": `Zoho-authtoken ${this.AUTHTOKEN}` }
    }

    /**
     * Default request methode
     * @param {*} method 
     * @param {*} url 
     */
    async request(method, url, headers = this.HEADERS, body = JSON.stringify({})) {
        try {
            let res
            if (method === 'GET') {
                res = await fetch(url, {
                    method: method,
                    headers: headers
                })
            } else {
                res = await fetch(url, {
                    method: method,
                    headers: headers,
                    body: body
                })
            }

            // will detect if an error occure on zoho
            if (res.code && res.message) {
                throw new Error(res)
            }

            return await res.json()
        }
        catch (e) {
            return Promise.reject({ error: e })
        }
    }

    /**
     * return all record From Zoho by the type in param
     * @param {*} type 
     * @param {*} params
     */
    async fetch(type, params = {}) {
        params = Util.objectToURIParam(params)

        return await this.request('GET', `${this.API_ADDRESS}${type}?organization_id=${this.ORGANISATION_ID}&${params}`)
    }

    /**
     * update a record to Zoho by the type in param
     * @param {*} type 
     */
    async update(type, id, object) {
        const form = new FormData();
        form.append('JSONString', JSON.stringify(object))

        // Add token to the header
        let headers = form.getHeaders()
        headers["Authorization"] = `Zoho-authtoken ${this.AUTHTOKEN}`

        return await this.request('PUT', `${this.API_ADDRESS}${type}/${id}?organization_id=${this.ORGANISATION_ID}`, headers, form)
    }

    /**
     * create a record to Zoho by the type in param
     * @param {*} type 
     */
    async create(type, object) {
        const form = new FormData();
        form.append('JSONString', JSON.stringify(object))

        // Add token to the header
        let headers = form.getHeaders()
        headers["Authorization"] = `Zoho-authtoken ${this.AUTHTOKEN}`

        return await this.request('POST', `${this.API_ADDRESS}${type}?organization_id=${this.ORGANISATION_ID}`, headers, form)
    }

    /**
     * Fetch one record
     * @param {*} type 
     * @param {*} id 
     */
    async fetchOne(type, id, params = {}) {
        params = Util.objectToURIParam(params)
        return await this.request('GET', `${this.API_ADDRESS}${type}/${id}?organization_id=${this.ORGANISATION_ID}&${params}`)
    }

}