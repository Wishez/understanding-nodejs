const path = require('path')
const fs = require('fs')

const resolvePath = (pathName) => {
  return path.join(process.cwd(), pathName)
}

const STATIC_PATH = resolvePath('static')
const sendFile = (res, path) => res.sendFile(resolvePath(path))
const getHtmlPath = (htmlPath) => path.join(STATIC_PATH, htmlPath)

const showPage = (res, pageHtmlPath) => {
  const template = fs.readFileSync(getHtmlPath('index.html'), "utf8")
  const pageContent = fs.readFileSync(getHtmlPath(pageHtmlPath), "utf8")
  const page = template.replace('{{content}}', pageContent)
  console.log(page)  
  res.send(page)
}


module.exports = { resolvePath, sendFile, showPage, getHtmlPath }
