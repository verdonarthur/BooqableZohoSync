module.exports = class Utils{
    static formatDateForDescrition(date){
        return `${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()}`
    }
}