const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const _ = require('./helpers')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()

// Addons
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// Static files
app.use('/static', express.static(_.resolvePath('static')))
app.use(express.static(_.resolvePath('node_modules')))

// routes
app.use(adminRoutes)
app.use(shopRoutes)

app.use('/', (req, res) => {
  console.log(req.url)
  _.showPage(res, '404.html')
})

// Server
const PORT = 6080
app.listen(PORT, () => {
  console.log(`Server listen on ${PORT} port`)
})
