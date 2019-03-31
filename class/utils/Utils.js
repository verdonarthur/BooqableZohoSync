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
}