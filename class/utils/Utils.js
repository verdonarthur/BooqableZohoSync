const fetch = require('node-fetch');

module.exports = class Utils {
    static formatDateForDescrition(date) {
        return `${date.getDay()}/${date.getMonth() + 1}/${date.getFullYear()}`
    }

    /**
     * https://stackoverflow.com/questions/6566456/how-to-serialize-an-object-into-a-list-of-url-query-parameters
     * @param {*} object 
     */
    static objectToURIParam(object) {
        return Object.entries(object).map(([key, val]) => `${key}=${val}`).join('&');
    }

    /**
     * Default request methode
     * @param {*} method 
     * @param {*} url 
     */
    static async request(method, url, headers, body = JSON.stringify({})) {
        try {            
            let options = {
                method: method,
                headers: headers,
                body: body
            }

            if (method === 'GET')
                delete options.body

            let res = await fetch(url, options)

            return await res.json()
        }
        catch (e) {
            return Promise.reject({ error: e })
        }
    }
}