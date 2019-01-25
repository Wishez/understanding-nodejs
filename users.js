const http = require('http')
const fs = require('fs')
const path = require('path')

const resolve = (pathName) => {
  return path.join(process.cwd(), pathName)
}

const server = http.createServer(routes)
const PORT = 3080

const USERS_FILE_NAME = resolve('users.txt')
if (!fs.existsSync(USERS_FILE_NAME)) {
	createUser({ firstName: 'First', lastName: 'User' })
}
server.listen(PORT, () => {
	console.log(`Server listen on ${PORT} port!🤖`)
})


const Urls = {
	MAIN: '/',
	USERS: '/users',
	CREATE_USER: '/create-user',
}

function routes(req, res) {
	const url = req.url
	const method = req.method
	if (method === 'POST') {
		makePostResponse({ url, req, res })
	} else if (method === 'GET') {
		makeGetResponse({ url, req, res })
	} 
	
	return res.end()
}

function makePostResponse({ url, req, res }) {
	let body = []
	req.on('data', chunk => {
		body.push(chunk)
	})

	req.on('end', () => {
		const parsedBody = Buffer.concat(body).toString()
		const payload = getQueryParams(parsedBody)
		makePostActionByUrl(url, () => createUser(payload))
	})

	makePostActionByUrl(url, () => redirect({ res, location: '/users', statusCode: 302 }))
}

function getQueryParams(query) {
	const splitedParams = query.split('&')

	const params = {}
	splitedParams.forEach(param => {
		const paramParts = param.split('=')
		const key = paramParts[0]
		const value = paramParts[1]
		params[key] = value
	})

	return params
}

function makePostActionByUrl(url, callback) {
	switch(url) {
		case Urls.CREATE_USER:
			callback()
			break;
		default:
	}
}

function redirect({ res, location, statusCode = 200 }) {
	res.setHeader('Location', location)
	res.statusCode = statusCode
}

function createUser(userData) {
	const { firstName, lastName } = userData
	if (firstName && lastName) {
		fs.writeFileSync(USERS_FILE_NAME, `${getUsersFile()}\n${firstName} ${lastName}\r`)
	}
}

function getUsersFile() {
	return fs.readFileSync(USERS_FILE_NAME).toString()
}

function makeGetResponse({ url, req, res }) {
	switch(url) {
		case Urls.MAIN:
			renderMainPage(res);
			break;
		case Urls.USERS:
			renderUsersPage(res);
			break;
		default:
			break;
	}
}

function renderMainPage(res) {
	const mainPageTitle = 'Hello, pal!'
	renderPage({ 
		res, 
		htmlStrings: [
		'<header><h1>I make web!</h1></header>',
		'<main>',
		'<h2>Let\'s get fun from this assigment;D</h2>',
		'<p>You can watch on <a href="/users">users</a>.</p>',
		'</main>',
		],
		pageTitle: mainPageTitle,
	})
}

function renderPage({ res, htmlStrings, pageTitle }) {
	openHtml(res, pageTitle)
	renderHtml(res, htmlStrings)
	closeHtml(res)
}

function openHtml(res, pageTitle) {
	renderHtml(res, [
		'<!DOCTYPE html>',
		'<html>',
		`<head>
			<title>${pageTitle}</title>
			<style>
				*+* { margin-top: 1em;} body {font-size: calc(1vw + 1em); font-family: Verand, sans-serif; line-height: 1.5; max-width: 65ch; margin: .5em auto 1em;}
				h1,h2,h3 {margin-bottom:-.5em}
				.redirect-link {display: flex;width:max-content; margin-left: auto; margin-right: auto;}
				button {font-size: 1em;border: 2px solid #333;background-color:darkorange;color:#fff;padding:.25em 1em .4em;margin: 0 auto 1.5em;display:block;	}
				input { font-size: 1em;padding: .5em .25em;	margin: 0 0 1em;width:390px}
				label {transform: translateX(-134px);}
				.fieldContainer {margin-top: .25em;display: flex;flex-direction:column;align-items: center}
				footer {display: flow-root; text-align: right;margin-top:2em;}
			</style>
		</head>`,
		'<body>',
	])
}

function closeHtml(res) {
	renderHtml(res, [
		'<footer>With love, <a href="https://shining-present.ru" target="_blank">Fillip Zhuravlev</a></footer>',
		'</body>',
		'</html>',
	])
}

function renderHtml(res, htmlStrings) {
	htmlStrings.forEach(htmlString => {
		res.write(htmlString)
	})
}

function renderUsersPage(res) {
	const pageTitle = 'Users list!'
	const usersList = getUsersList()
	renderPage({ 
		res, 
		htmlStrings: [
		'<main>',
		'<h1>This is the list of all existed users</h1>',
		`<ul>${usersList}</ul>`,
		'<section><h2>Add someone or yourself</h2>',
		'<form action="/create-user" method="POST">',
		makeInput('First name', { placeholder: 'Richard', name: 'firstName'}),
		makeInput('Last name', { placeholder: 'Faynman', name: 'lastName'}),
		'<button type="submit">Create</button>',
		'</form>',
		'</section>',
		'<a class="redirect-link" href="/">To main page</a>',
		'</main>',
		],
		pageTitle,
	})
}

function getUsersList() {
	const usersFile = getUsersFile()
	const users = usersFile.split('\r\n')
	
	let usersList = ''
	users.forEach(user => {
		usersList += `<li>${user.replace('+', ' ')}</li>`
	})

	return usersList
}

function makeInput(labelText, input) {
	const { placeholder, name } = input 
	return `<div class="fieldContainer">
		<label id="${name}Label" for="${name}">${labelText}</label>
		<input id="${name}" name="${name}" aria-labelledby="${name}Label" placeholder="${placeholder}" />
	</div>`
}