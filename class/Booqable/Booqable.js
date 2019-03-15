const config = require('../config/config')

module.exports = class Booqable {
    constructor(API_ADDRESS = config.booqable_api_address, APIKEY=config.booqable_api_key) {
        this.API_ADDRESS = API_ADDRESS
        this.APIKEY = APIKEY

        this.HEADERS = { 'Content-Type': 'application/json' }
    }
}