const mongoose = require('mongoose')
const Zoho = require('../utils/Zoho')

let customerSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    booqableID: {
        type: String,
        required: true,
    },
    zohoID: {
        type: String,
        required: true,
    },
    lastUpdate: {
        type: Date
    }
})

/**
 * Return all contacts from zoho
 */
customerSchema.statics.getAllFromZoho = async function() {
    let zoho = new Zoho()
    let res = await zoho.fetchFromZoho('contacts')
    return res.contacts
}

/**
 * 
 */
customerSchema.statics.getAllFromBooqable = function() {
    // TODO
}

customerSchema.static.findByZohoID = async function(zohoID){
    return await this.findOne({ zohoID: zohoID })
}

module.exports = mongoose.model('Customer', customerSchema)