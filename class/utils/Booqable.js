const fetch = require('node-fetch');

const config = require('../../config/config')

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
     * return all record From Booqable by the type in param
     * @param {*} type 
     */
    async fetch(type) {
        try {
            let res = await fetch(`${this.API_ADDRESS}${type}?api_key=${this.APIKEY}`, {
                method: 'GET',
                headers: this.HEADERS,
            })
            return await res.json()

        } catch (e) {
            console.log(e)
            return e
        }
    }

    /**
     * return one record From booqable by the type and id in param
     * @param {*} type 
     * @param {*} id
     */
    async fetchOne(type, id) {
        try {
            let res = await fetch(`${this.API_ADDRESS}${type}/${id}?api_key=${this.APIKEY}`, {
                method: 'GET',
                headers: this.HEADERS,
            })
            return await res.json()

        } catch (e) {
            console.log(e)
            return e
        }
    }

    /**
     * create a record to booqable
     * @param {*} type 
     */
    async create(type, object) {
        
        try {
            let res = await fetch(`${this.API_ADDRESS}${type}?api_key=${this.APIKEY}`, {
                method: 'POST',
                headers: this.HEADERS,
                body: JSON.stringify(object)
            })
            return await res.json()
        } catch (e) {
            console.log(e)
            return e
        }
    }

    /**
     * update a record to booqable
     * @param {*} type 
     */
    async update(type, id, object) {
        try {
            let res = await fetch(`${this.API_ADDRESS}${type}/${id}?api_key=${this.APIKEY}`, {
                method: 'PUT',
                headers: this.HEADERS,
                body: JSON.stringify(object)
            })
            return await res.json()
        } catch (e) {
            console.log(e)
            return e
        }
    }

    /**
     * will delete a record in booqable
     * @param {*} type 
     * @param {*} id 
     */
    async delete(type, id){
        try {
            let res = await fetch(`${this.API_ADDRESS}${type}/${id}/archive?api_key=${this.APIKEY}`, {
                method: 'DELETE',
                headers: this.HEADERS,
            })
            return await res.json()
        } catch (e) {
            console.log(e)
            return e
        }
    }
}