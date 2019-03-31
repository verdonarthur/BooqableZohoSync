import BasicResource from './BasicResource'

class Invoice extends BasicResource {
    static async getAll() {
        return await super.getAll('invoice')
    }

    static async exportToZoho() {
        return await super.getRequest(this.URL_BACKEND + `/invoice/exportInvoiceToZoho`)
    }
}

export default Invoice