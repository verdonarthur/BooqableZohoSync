module.exports = {
    zoho: {
        //created_time: "created_time",
        //last_modified_time: "last_modified_time",
        id: "contact_id",
        name: "contact_name",
        email: "email",
        phone: "phone",
        billing: {
            address: "billing_address.address",
            zipcode: "billing_address.zip",
            city: "billing_address.city",
            region: "billing_address.region",
            country: "billing_address.country",
        },
        shipping: {
            address: "shipping_address.address",
            zipcode: "shipping_address.zip",
            city: "shipping_address.city",
            region: "shipping_address.region",
            country: "shipping_address.country"
        }


        //"zipcode":"",
        //"city":"",
        //"region":"",
        //"country":""
    },
    booqable: {
        //created_time: "created_at",
        //last_modified_time: "updated_at",
        id: "id",
        name: "name",
        email: "email",
        phone: "phone",
        shipping:{
            address:""
        }
        //"address":"address1",
        //"zipcode":"zipcode",
        //"city":"city",
        //"region":"region",
        //"country":"country"
    }
}