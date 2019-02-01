const fs = require('fs')

const requestHandler = (req, res) => {
  const { url, method } = req 
  if (method === 'POST') {
    handlePostRequest({ url, req, res });
  } else {
    renderHTML(res, getPageContent(url))
  }

  return res.end()
}

function handlePostRequest({ req, res, url }) {
  const body = []
  req.on('data', chunk => {
    body.push(chunk)
  })

  req.on('end', () => {
    const parsedBody = Buffer
      .concat(body)
      .toString()

    switch (url) {
      case '/api/message':
        formMessageHander(res, parsedBody)
        break;
      default:
        break;
    }

  })
  
  res.setHeader('Location', '/simple-form')
  res.statusCode = 302
}

function formMessageHander(res, body) {
  const formData = parseData(body)
  fs.writeFileSync('message.txt', `Last message: ${formData.message}`)
}

function parseData(query) {
  const splitedQuery = query.split('=')

  const parsedQuery = {}
  for (let i = 0; i < splitedQuery.length/2; i+=2) {
    const key = splitedQuery[i]
    const value = splitedQuery[i+1]
    parsedQuery[key] = value
  }

  return parsedQuery
}

function getPageContent(url) {
  let title, html;
  switch(url) {
    case '/':
      title = 'Main page'
      html = `<h1>It's a main page!</h1>
        <p>Say us something interesting <a href="/simple-form">
        here
        </a>.</p>
      `
      break;
    case '/simple-form':
      title = 'Next page'
      html = `<h1>You see form with message input</h1>
      <form method="POST" action="/api/message">
        <div>
          <label for="message" id="messageLabel">Type message</label>
          <input id="message" name="message" placeholder="I can write 'asdasr3232asdas'. You can write same awesome sentance!"/>
        </div>

        <button type="sumbit">Say</button>
      </form>`
      break;
    default:
      title = 'Not found'
      html = '<h1>Hello, Pal!</h1><p>Try to get another page. There is nothing here, except this text.</p>'
      break;
  }

  return { title, html }
}

function renderHTML(res, { html, title }) {
  res.write('<html>')
  res.write(`<head><title>${title}</title></head>`)
  res.write(`<body>${html}</body>`)
  res.write('</html>')
}

module.exports = {
  handler: requestHandler,
}
