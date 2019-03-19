const mongoose = require('mongoose')
const Zoho = require('../utils/Zoho')
const Booqable = require('../utils/Booqable')
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

invoiceLineSchema.statics.formatArrayOfLinesForZoho = function (lines) {
    let zohoLines = []

    for (const line of lines) {
        zohoLines.push(line.formatForZoho())
    }

    return zohoLines
}

// ------------------------------------------ METHODS -------------------------------------------------
invoiceLineSchema.methods.formatForZoho = function () {
    return {
        item_id: this.zohoItemID,
        title: this.title,
        rate: this.totalPriceInCents / 1000,
        quantity: this.quantity
    }
}


const InvoiceLine = mongoose.model('InvoiceLine', invoiceLineSchema)



let invoiceSchema = new mongoose.Schema({
    booqableCustomerID: {
        type: String,
        required: true,
    },
    zohoCustomerID: {
        type: String,
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
            zohoCustomerID = (await Customer.findByBooqableID(booqableOrder.customerID)).zohoID

            if (!zohoCustomerID) { throw new Error(`Customer with booqable ID ${booqableOrder.customerID} is not in local db`) }
            let localDBInvoice = new Invoice({
                booqableCustomerID: booqableOrder.customerID,
                zohoCustomerID: zohoCustomerID,
                reference: `Booqable order ${booqableOrder.number}`,
                lines: InvoiceLine.convertFromBooqableOrderLineArray(booqableOrder.lines)
            })

            // TODO : ARCHIVE ORDER

            await localDBInvoice.save()
        }
    } catch (err) {
        console.log(err)
        return { error: err }
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
        line_items: InvoiceLine.formatArrayOfLinesForZoho(this.lines)
    }

    try {
        let res = await zoho.create('invoices', zohoInvoice)
        if (res.code != 0) {
            throw new Error(JSON.stringify(res))
        } else {
            console.log('new invoice in zoho : ', zohoInvoice)
            return await res
        }
    } catch (err) {
        console.log(err)
        return { error: err }
    }
}

const Invoice = mongoose.model('Invoice', invoiceSchema)
module.exports = Invoice