const path = require('path')
const http = require('http')
const express = require('express')
const morgan = require('morgan')

const routes = require('./routes')

const resolve = (pathName) => {
  return path.join(process.cwd(), pathName)
}

// const app = express()

// Addons
// app.use(morgan())

// Static files
// app.use('/static', express.static(resolve('static')))
// app.use(express.static(resolve('node_modules')))


// routes
// app.use('/', (req, res) => {
//   console.log(req.url)
//   res.sendFile(resolve('static/hello.html'))
// })

// Server
const PORT = 3080
// const server = http.createServer(app)
const server = http.createServer(routes.handler)

server.listen(PORT, () => {
  console.log(`Server listen on ${PORT} port`)
})

// fs.writeFileSync('hello.txt', 'Hello from Node.js')
