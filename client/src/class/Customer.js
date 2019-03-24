import BasicResource from './BasicResource'

class Customer extends BasicResource{
  static async getAll(){
    return await super.getAll('customer')
  }
}

export default Customer