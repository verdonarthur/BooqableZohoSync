let Customer = require("./class/model/Customer")

async function main() {
    console.log(await Customer.getAllFromZoho())
}

main()