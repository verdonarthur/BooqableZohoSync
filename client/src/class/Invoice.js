import BasicResource from './BasicResource'

class Invoice extends BasicResource {
    static async getAll(){
        return await super.getAll('invoice')
    }
  }
  
  export default Invoice