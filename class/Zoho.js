const fetch = require('node-fetch');

const config = require('../config/config')

module.exports = class Zoho {
    constructor() {
        this.API_ADDRESS = config.zoho_api_address
        this.AUTHTOKEN = config.zoho_books_authtoken
        this.ORGANISATION_ID = config.zoho_organisation_id
        this.HEADERS = { 'Content-Type': 'application/json', "Authorization": `Zoho-authtoken ${this.AUTHTOKEN}` }
    }

    async getAllContact() {
        try {
            console.log(`${this.API_ADDRESS}contacts?organization_id=${this.ORGANISATION_ID}`)
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
    }
}