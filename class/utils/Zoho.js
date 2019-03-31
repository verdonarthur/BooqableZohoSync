const fetch = require('node-fetch');
const FormData = require('form-data');
const Util = require('./Utils')

const config = require('../../config/config')

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
     * return all record From Zoho by the type in param
     * @param {*} type 
     * @param {*} params
     */
    async fetch(type, params = {}) {
        params = Util.objectToURIParam(params)

        try {
            let res = await fetch(`${this.API_ADDRESS}${type}?organization_id=${this.ORGANISATION_ID}&${params}`, {
                method: 'GET',
                headers: this.HEADERS,
            })
            res = await res.json()
            return res
        } catch (e) {
            return Promise.reject( { error: e })
        }
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
        headers["Authorization"]= `Zoho-authtoken ${this.AUTHTOKEN}`


        try {
            let res = await fetch(`${this.API_ADDRESS}${type}/${id}?organization_id=${this.ORGANISATION_ID}`, {
                method: 'PUT',
                headers: headers,
                body: form
            })
            res = await res.json()
            return res
        } catch (e) {
            return Promise.reject( { error: e })
        }
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
        headers["Authorization"]= `Zoho-authtoken ${this.AUTHTOKEN}`


        try {
            let res = await fetch(`${this.API_ADDRESS}${type}?organization_id=${this.ORGANISATION_ID}`, {
                method: 'POST',
                headers: headers,
                body:form
            })
            
            res = await res.json()
            return res
        } catch (e) {
            return Promise.reject( { error: e })
        }
    }

}