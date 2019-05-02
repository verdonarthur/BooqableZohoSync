const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const logger = require('./class/utils/Logger')
const CronSyncManager = require('./class/cron/CronSyncManager')

const app = express()
const config = require('./config/generatedConfig')
const port = process.env.PORT || 3001

/*+++++++++++++++EXPRESS CONFIGURATION++++++++++++++++++*/
app.use(express.json())       // to support JSON-encoded bodies
app.use(express.urlencoded()) // to support URL-encoded bodies
app.use(cors())		      // to have CORS HEADER

/*+++++++++++++++MONGOOSE CONFIGURATION++++++++++++++++++*/
mongoose.connect(config.url_database)

/*+++++++++++++++API ROUTE LOADING++++++++++++++++++*/
// example : app.use('/api/user', user)
app.use('/customer', require('./routes/customerRouter'))
app.use('/product', require('./routes/productRouter'))
app.use('/invoice', require('./routes/invoiceRouter'))
app.use('/log', require('./routes/logRouter'))

app.use('/', express.static(path.resolve(__dirname, 'client/dist')))
//app.use('/', express.static(path.resolve(__dirname, 'www')))

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    res.sendStatus(404)
})

/*+++++++++++++++CRON JOB START++++++++++++++++++*/
if (process.env.NODE_ENV != 'production')
    new CronSyncManager('http://localhost', port)
else
    new CronSyncManager('http://localhost', port)



/*+++++++++++++++EXPRESS APP START++++++++++++++++++*/
app.listen(port,
    () => {
        logger.info(`App running on : https://localhost:${port} !`)
    })
