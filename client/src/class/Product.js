import BasicResource from './BasicResource'

class Product extends BasicResource{
    static async getAll(){
      return await super.getAll('product')
    }
    
    static async sync(){
      return await super.sync('product')
    }
  }
  
  export default Product