import BasicResource from './BasicResource'

class Log extends BasicResource {
    static async getAll(){
        return await super.getAll('log')
    }
  }
  
  export default Log