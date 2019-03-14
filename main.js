const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000



/*+++++++++++++++EXPRESS CONFIGURATION++++++++++++++++++*/
app.use(express.json())       // to support JSON-encoded bodies
app.use(express.urlencoded()) // to support URL-encoded bodies
app.use(cors())		      // to have CORS HEADER

/*+++++++++++++++MONGOOSE CONFIGURATION++++++++++++++++++*/
//mongoose.connect(config.urlDatabase)

/*+++++++++++++++API ROUTE LOADING++++++++++++++++++*/
const ContactRouter = require('./routes/contactRouter')

// example : app.use('/api/user', user)

app.get('/', (req, res) => {
    res.send("app running")
});
app.use('/contact', ContactRouter)


// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    //next(err)
    res.sendStatus(404)
})

app.listen(port,
    () => console.log(`App running on : https://localhost:${port} !`))