class BasicResource {

    static async getAll(resource) {
        try {
            let data = await fetch(`//localhost:3001/${resource}/`, { accept: 'application/json' })
            return data.json()
        } catch (e) {
            console.log(e)
            return {}
        }
    }
}

export default BasicResource