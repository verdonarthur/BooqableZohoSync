const config = require('./config')

module.exports = {
    zoho_api_address: process.env.ZOHO_API_ADDRESS || config.zoho_api_address,
    zoho_books_authtoken: process.env.ZOHO_AUTHTOKEN || "97d89d889a6423cca223a93d8d74c1f0",
    zoho_organisation_id: process.env.ZOHO_ORGANISATION_ID || 20065941545,
    booqable_api_key: process.env.BOOQABLE_API_KEY || "948ea62d2351268ef674fb9009d2d315",
    booqable_api_address: process.env.BOOQABLE_API_ADDRESS || "https://dhf79728.booqable.com/api/1/",
    url_database: process.env.MONGODB_URI || 'mongodb://localhost:27017/zobosync',
}