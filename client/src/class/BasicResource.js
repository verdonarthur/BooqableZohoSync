class BasicResource {
    static get URL_BACKEND(){
        return process.env.MONGODB_URI || "//localhost:3001"
    }

    static async getRequest(url) {
        try {
            let data = await fetch(url, { accept: 'application/json' })
            return data.json()
        } catch (e) {
            console.log(e)
            return Promise.reject()
        }
    }

    static async getAll(resource) {
        return this.getRequest(`${this.URL_BACKEND}/${resource}/`)
    }

    static async sync(resource){
        return this.getRequest(`${this.URL_BACKEND}/${resource}/sync`)
    }

    static async syncFrom(resource, system) {
        return this.getRequest(`${this.URL_BACKEND}/${resource}/sync/${system}`)
    }
}

export default BasicResource