const mongoose = require('mongoose')
const Zoho = require('../utils/Zoho')
const Booqable = require('../utils/Booqable')

let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    priceInCents: {
        type: Number,
    },
    sku: {
        type: String,
    },
    booqableID: {
        type: String,
        unique: true,
        sparse: true
    },
    zohoID: {
        type: String,
        unique: true,
        sparse: true
    },
    booqableLastUpdate: {
        type: Date,
    },
    zohoLastUpdate: {
        type: Date,
    }
}, { timestamps: true })

// ------------------------------------------ STATICS METHODS -------------------------------------------------


/**
 * Return all contacts from zoho
 */
productSchema.statics.getAllFromZoho = async function () {
    let zoho = new Zoho()
    let res = await zoho.fetch('items')
    return res.items
}

/**
 * get all customer from booqable
 */
productSchema.statics.getAllFromBooqable = async function () {
    let booqable = new Booqable()
    let res = await booqable.fetch('product_groups')
    return res.product_groups
}

/**
 * Find a record by the zoho id
 * @param {*} zohoID
 */
productSchema.statics.findByZohoID = async function (zohoID) {
    return await this.findOne({ zohoID: zohoID })
}

/**
 * Find a record by the booqable id
 * @param {*} zohoID
 */
productSchema.statics.findByBooqableID = async function (booqableID) {
    return await this.findOne({ booqableID: booqableID })
}

/**
 * Will create or update a product by a zoho contact
 * 
 * @param {*} zohoItem
 */
productSchema.statics.fromZoho = function (zohoItem) {
    let zohoID = zohoItem.item_id
    let zohoName = zohoItem.name
    let zohoPrice = zohoItem.rate * 100
    let zohoSKU = zohoItem.sku
    let zohoLastUpdate = zohoItem.last_modified_time
    
    return new Product({ name: zohoName, priceInCents: zohoPrice, sku: zohoSKU, zohoID: zohoID, zohoLastUpdate: zohoLastUpdate })
}

/**
 * Will create or update a product by a booqable product
 * 
 * @param {*} booqableProduct
 */
productSchema.statics.fromBooqable = function (booqableProduct) {
    let booqableID = booqableProduct.id
    let booqableName = booqableProduct.name
    let booqableSKU = booqableProduct.sku
    let booqablePrice = booqableProduct.base_price_in_cents
    let booqableLastUpdate = booqableProduct.updated_at

    return new Product({ name: booqableName, priceInCents: booqablePrice, sku: booqableSKU, booqableID: booqableID, booqableLastUpdate: booqableLastUpdate })
}

// ------------------------------------------ METHODS -------------------------------------------------

/**
 * Will set the field to sync on the current record
 */
productSchema.methods.setFieldToSync = function (product) {
    this.name = product.name
    this.sku = product.sku
    this.priceInCents = product.priceInCents

    if (product.zohoLastUpdate) {
        this.zohoLastUpdate = new Date(product.zohoLastUpdate)
    }
    else {
        this.booqableLastUpdate = new Date(product.booqableLastUpdate)
    }

}

/**
 * Will save or update the record to booqable
 */
productSchema.methods.saveToBooqable = async function () {
    let booqable = new Booqable()

    let booqableProduct = {
        name: this.name,
        sku: this.sku != '' ? this.sku : this.name.replace(' ','-').trim().toUpperCase(),
        base_price_in_cents: this.priceInCents,
        flat_fee_price_in_cents:this.priceInCents,
        price_type: "simple",
        price_period: "day"
    }

    try {
        // if contact exist already on booqable
        if (this.booqableID) {
            return await booqable.update('product_groups', this.booqableID, { product_group: booqableProduct })
        } else {
            let res = await booqable.create('product_groups', booqableProduct)

            if(res.errors){
                throw new Error(JSON.stringify(res.errors))
            }
            
            this.booqableID = res.product_group.id
            this.booqableLastUpdate = res.product_group.updated_at
            return await this.save()

        }
    } catch (err) {
        console.log(err)
        return err
    }
}

/**
 * Will save or update the record to zoho
 */
productSchema.methods.saveToZoho = async function () {
    let zoho = new Zoho()

    let zohoCustomer = {
        name: this.name,
        sku: this.sku,
        rate: this.priceInCents / 100
    }
    try {
        // if contact exist already on zoho
        if (this.zohoID) {
            let res = await zoho.update('items', this.zohoID, zohoCustomer)
            if (res.code != 0) {
                throw new Error(JSON.stringify(res))
            }
            return res
        } else {
            let res = await zoho.create('items', zohoCustomer)
            if (res.code != 0) {
                throw new Error(JSON.stringify(res))
            } else {
                this.zohoID = res.item.item_id
                this.zohoLastUpdate = res.item.last_modified_time
                return await this.save()
            }

        }
    } catch (err) {
        console.log(err)
        return err
    }
}

const Product = mongoose.model('Product', productSchema)
module.exports = Product