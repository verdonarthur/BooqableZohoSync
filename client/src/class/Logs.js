import BasicResource from './BasicResource'

class Logs extends BasicResource {
    static async getAll(){
        return await super.getAll('log')
    }
  }
  
  export default Logs