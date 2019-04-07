const mongoose = require('mongoose')
const Zoho = require('../utils/Zoho')
const Booqable = require('../utils/Booqable')
const Utils = require('../utils/Utils')
const BooqableOrder = require('./BooqableOrder')
const Customer = require('./Customer')

// ------------------------------------------ INVOICE LINE SCHEMA -------------------------------------------------

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

invoiceLineSchema.statics.formatArrayOfLinesForZoho = async function (lines, customQuantity, description) {
    let zohoLines = []
    description = description ? description : ''

    for (const line of lines) {
        let productLinked = await line.getProductLinked()
        line.quantity = customQuantity ? customQuantity : line.quantity
        line.description = description
        if (productLinked.description) {
            line.description = description + `\nDescription du produit : ${productLinked.description}`
        }

        zohoLines.push(line.formatForZoho())
    }

    return zohoLines
}

// ------------------------------------------ METHODS -------------------------------------------------
invoiceLineSchema.methods.formatForZoho = function () {
    return {
        item_id: this.zohoItemID,
        title: this.title,
        rate: (this.totalPriceInCents / 100) / this.quantity,
        quantity: this.quantity,
        description: this.description
    }
}

invoiceLineSchema.methods.getProductLinked = async function () {
    return (await (new Booqable()).fetchOne('product_groups', this.booqableItemID)).product_group
}


const InvoiceLine = mongoose.model('InvoiceLine', invoiceLineSchema)

// ------------------------------------------ INVOICE SCHEMA -------------------------------------------------

let invoiceSchema = new mongoose.Schema({
    booqableID: {
        type: String,
        unique: true
    },
    booqableCustomerID: {
        type: String,
        required: true,
    },
    zohoCustomerID: {
        type: String,
    },
    startDate: {
        type: Date
    },
    stopDate: {
        type: Date
    },
    nbrLocationDay: {
        type: Number
    },
    reference: {
        type: String,
    },
    lines: {
        type: [invoiceLineSchema],
    },
    isSaveInZoho: {
        type: Boolean,
        default:false
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
                startDate: booqableOrder.startsAt,
                stopDate: booqableOrder.stopsAt,
                nbrLocationDay: booqableOrder.getNbrDay(),
                reference: `Booqable order ${booqableOrder.number}`,
                lines: InvoiceLine.convertFromBooqableOrderLineArray(booqableOrder.lines)
            })

            await localDBInvoice.save()

            // ARCHIVE ORDER
            let booqable = new Booqable()
            await booqable.specialPostRequest('orders',booqableOrder.id, 'archive')
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
    if(this.isSaveInZoho)
        return Promise.resolve()
    
    let zoho = new Zoho()

    try {
        let zohoInvoice = {
            customer_id: this.zohoCustomerID,
            reference_number: this.reference,
            line_items: await InvoiceLine.formatArrayOfLinesForZoho(
                this.lines,
                this.nbrLocationDay,
                `Location du ${Utils.formatDateForDescrition(this.startDate)} au ${Utils.formatDateForDescrition(this.stopDate)}`
            )
        }

        let res = await zoho.create('invoices', zohoInvoice)

        this.isSaveInZoho = true
        await this.save()

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