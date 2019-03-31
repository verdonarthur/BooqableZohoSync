let Product = require("./class/model/Product")

async function main() {
    console.log(await Product.getAllFromZoho())
}

main()