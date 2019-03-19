const Booqable = require('../utils/Booqable')
const Product = require('./Product')
let booqable = new Booqable()


class BooqableOrderLine {

    /**
     * 
     * @param {*} title 
     * @param {*} quantity 
     * @param {*} totalPriceInCents 
     * @param {*} zohoItemID 
     * @param {*} booqableItemID 
     */
    constructor(title, quantity, totalPriceInCents, zohoItemID, booqableItemID) {
        this.title = title
        this.quantity = quantity
        this.totalPriceInCents = totalPriceInCents
        this.zohoItemID = zohoItemID
        this.booqableItemID = booqableItemID
    }

    /**
     * 
     * @param {*} booqableLines 
     */
    static async createFromBooqableOrderLines(booqableLines) {
        let lines = []
        try {
            for (const booqableLine of booqableLines) {
                let booqableItemID, zohoItemID

                let localDBProduct = await Product.findOne({ name: booqableLine.title })

                if (!localDBProduct) { throw new Error("No product with this name : " + booqableLine.title) }

                booqableItemID = localDBProduct.booqableID
                zohoItemID = localDBProduct.zohoID

                lines.push(new BooqableOrderLine(booqableLine.title, booqableLine.quantity, booqableLine.price_in_cents, zohoItemID, booqableItemID))
            }

            return lines
        } catch (err) {
            console.log(err)
            return { error: err }
        }
    }
}


module.exports = class BooqableOrder {
    /**
     * 
     * @param {*} customerID 
     * @param {*} lines 
     */
    constructor(customerID, lines, number) {
        this.customerID = customerID
        this.lines = lines
        this.number = number
    }

    /**
     * 
     */
    static async getAllStoppedOrder() {
        let ordersWithDetail = []

        try {
            let orders = (await booqable.fetch('orders')).orders

            for (const order of orders) {
                if (order.status == 'stopped') {
                    ordersWithDetail.push(await this.getOrderDetail(order.id))
                }
            }

            return ordersWithDetail
        } catch (err) {
            console.log(err)
            return { error: err }
        }
    }

    /**
     * 
     * @param {*} orderID 
     */
    static async getOrderDetail(orderID) {
        try {
            let tmpOrder = (await booqable.fetchOne('orders', orderID)).order
            return new BooqableOrder(tmpOrder.customer_id, await BooqableOrderLine.createFromBooqableOrderLines(tmpOrder.lines), tmpOrder.number)

        } catch (err) {
            console.log(err)
            return { error: err }
        }
    }
}