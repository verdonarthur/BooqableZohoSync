import BasicResource from './BasicResource'

class Product extends BasicResource{
    static async getAll(){
      return await super.getAll('product')
    }
  }
  
  export default Product