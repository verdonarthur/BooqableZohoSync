import BasicResource from './BasicResource'

class Customer extends BasicResource{
  static async getAll(){
    return await super.getAll('customer')
  }

  static async sync(){
    return await super.sync('customer')
  }
}

export default Customer