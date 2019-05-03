# BooqableZohoSync - A sync tool between Zoho Books and Booqable

## Installation
```
git clone https://github.com/verdonarthur/BooqableZohoSync.git
npm i
```

## Configuration for production environment
You must set the following environment variables :

name of the environment var | description
--- | ---
NODE_ENV  | must be set as production
PORT | The port where you want to use the app
ZOHO_API_ADDRESS | Address of your zoho API
ZOHO_AUTHTOKEN | The generated authoken for your Zoho Books
ZOHO_ORGANISATION_ID | The organisation ID of your Zoho Books
BOOQABLE_API_KEY | The generated api key for your booqable instance
BOOQABLE_API_ADDRESS | The api address of your booqable instance
MONGODB_URI | The connection string of your mongodb instance (see : https://docs.mongodb.com/manual/reference/connection-string/)

## Run the app
```
npm start
```
