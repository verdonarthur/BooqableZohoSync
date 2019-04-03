const config = require('./config')

module.exports = {
    zoho_api_address: process.env.ZOHO_API_ADDRESS || config.zoho_api_address,
    zoho_books_authtoken: process.env.ZOHO_AUTHTOKEN || config.zoho_books_authtoken,
    zoho_organisation_id: process.env.ZOHO_ORGANISATION_ID || config.zoho_organisation_id,
    booqable_api_key: process.env.BOOQABLE_API_KEY || config.booqable_api_key,
    booqable_api_address: process.env.BOOQABLE_API_ADDRESS || config.booqable_api_address,
    url_database: process.env.MONGODB_URI || config.url_database,
}