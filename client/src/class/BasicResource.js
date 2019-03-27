class BasicResource {

    static async getAll(resource) {
        try {
            let data = await fetch(`//localhost:3001/${resource}/`, { accept: 'application/json' })
            return data.json()
        } catch (e) {
            console.log(e)
            return Promise.reject()
        }
    }

    static async sync(resource){
        try {
            let data = await fetch(`//localhost:3001/${resource}/sync`, { accept: 'application/json' })
            return data.json()
        } catch (e) {
            console.log(e)
            return Promise.reject()
        }
    }
}

export default BasicResource