const fetch = require('node-fetch');

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
     */
    async fetchFromZoho(type) {
        try {
            let res = await fetch(`${this.API_ADDRESS}${type}?organization_id=${this.ORGANISATION_ID}`, {
                method: 'GET',
                headers: this.HEADERS,
            })
            res = await res.json()
            return res
        } catch (e) {
            console.log(e)
        }
    }

    /*
    async getAllContact() {
        try {
            let res = await fetch(`${this.API_ADDRESS}contacts?organization_id=${this.ORGANISATION_ID}`, {
                method: 'GET',
                //body:    JSON.stringify(body),
                headers: this.HEADERS,
            })
            res = await res.json()
            return res.contacts
        } catch (e) {
            console.log(e)
        }
    }*/
}