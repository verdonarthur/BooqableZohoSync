const mongoose = require('mongoose')
const Zoho = require('../utils/Zoho')
const Booqable = require('../utils/Booqable')
const Utils = require('../utils/Utils')
const BooqableOrder = require('./BooqableOrder')
const Customer = require('./Customer')

let invoiceLineSchema = new mongoose.Schema({
    zohoItemID: {
        type: String,
        required: true
    },
    booqableItemID: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPriceInCents: {
        type: Number,
        required: true
    }
}, { _id: false })

// ------------------------------------------ STATICS METHODS -----------------------------------------
invoiceLineSchema.statics.convertFromBooqableOrderLineArray = function (booqableOrderLines) {
    let invoiceLines = []

    for (const booqableOrderLine of booqableOrderLines) {
        invoiceLines.push({
            zohoItemID: booqableOrderLine.zohoItemID,
            booqableItemID: booqableOrderLine.booqableItemID,
            title: booqableOrderLine.title,
            quantity: booqableOrderLine.quantity,
            totalPriceInCents: booqableOrderLine.totalPriceInCents
        })
    }

    return invoiceLines
}

invoiceLineSchema.statics.formatArrayOfLinesForZoho = function (lines, customQuantity, description) {
    let zohoLines = []

    for (const line of lines) {
        zohoLines.push(line.formatForZoho())
        zohoLines.quantity = customQuantity ? customQuantity : zohoLines.quantity
        zohoLines.description = description ? description : ''
    }

    return zohoLines
}

// ------------------------------------------ METHODS -------------------------------------------------
invoiceLineSchema.methods.formatForZoho = function () {
    return {
        item_id: this.zohoItemID,
        title: this.title,
        rate: this.totalPriceInCents / 100,
        quantity: this.quantity
    }
}


const InvoiceLine = mongoose.model('InvoiceLine', invoiceLineSchema)



let invoiceSchema = new mongoose.Schema({
    booqableID:{
        type:String,
        unique:true
    },
    booqableCustomerID: {
        type: String,
        required: true,
    },
    zohoCustomerID: {
        type: String,
    },
    startDate:{
        type:Date
    },
    stopDate:{
        type:Date
    },
    nbrLocationDay: {
        type: number
    },
    reference: {
        type: String,
    },
    lines: {
        type: [invoiceLineSchema],
    }
}, { timestamps: true })


// ------------------------------------------ STATICS METHODS -------------------------------------------------

/**
 * retrieve Booqable order and save as invoice in local DB
 */
invoiceSchema.statics.saveBooqableOrderToLocalDB = async function () {

    try {
        let booqableOrders = await BooqableOrder.getAllStoppedOrder()

        let zohoCustomerID

        for (const booqableOrder of booqableOrders) {
            zohoCustomerID = await Customer.findByBooqableID(booqableOrder.customerID)

            if (!zohoCustomerID || !zohoCustomerID.zohoID) { throw new Error(`Customer with booqable ID ${booqableOrder.customerID} is not in local db`) }

            zohoCustomerID = zohoCustomerID.zohoID


            let localDBInvoice = new Invoice({
                booqableID: booqableOrder.id,
                booqableCustomerID: booqableOrder.customerID,
                zohoCustomerID: zohoCustomerID,
                startDate:new Date(booqableOrder.starts_at),
                stopDate:new Date(booqableOrder.stops_at),
                nbrLocationDay: (new Date(booqableOrder.stops_at) - new Date(booqableOrder.starts_at)) / (1000 * 60 * 60 * 24),
                reference: `Booqable order ${booqableOrder.number}`,
                lines: InvoiceLine.convertFromBooqableOrderLineArray(booqableOrder.lines)
            })

            // TODO : ARCHIVE ORDER
            
            await localDBInvoice.save()
        }
    } catch (err) {
        return Promise.reject({ error: err })
    }
}

// ------------------------------------------ METHODS -------------------------------------------------

/**
 * Will save or update the record to zoho
 */
invoiceSchema.methods.saveToZoho = async function () {
    let zoho = new Zoho()

    let zohoInvoice = {
        customer_id: this.zohoCustomerID,
        reference_number: this.reference,
        line_items: InvoiceLine.formatArrayOfLinesForZoho(this.lines,
            this.nbrLocationDay,
            `Location du ${Utils.formatDateForDescrition(this.startDate)} au ${Utils.formatDateForDescrition(this.stopDate)} \n`)
    }

    try {
        let res = await zoho.create('invoices', zohoInvoice)
        if (res.code != 0) {
            throw new Error(JSON.stringify(res))
        } else {
            return await res
        }
    } catch (err) {
        return Promise.reject({ error: err })
    }
}

const Invoice = mongoose.model('Invoice', invoiceSchema)
module.exports = Invoice