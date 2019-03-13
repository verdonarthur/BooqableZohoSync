module.exports = class Address {
    constructor(address, zipcode, city, region, country) {
        this.address = address
        this.zipcode = zipcode
        this.city = city
        this.region = region
        this.country = country
    }

    translateToBooqableAddress(name) {
        return {
            type: "Property::Address",
            name: name,
            address1: this.address,
            address2: "",
            zipcode: this.zipcode,
            region:this.region,
            city: this.city,
            country: this.country
        }
    }
}