const { exec } = require('child_process');
const express = require('express');
const http = require('http')
const path = require('path');
const { Recorder } = require('./Handlers')
var app = express();



let data = []

if (process.argv[2]) {
	data = require(`./${process.argv[2]}`)
} else {
	console.log('Usage: npm start PATH_TO_DATA.json (try "npm start sample.json")')
	process.exit(0)
}


app.set('port', (process.env.PORT || 8080));
app.use(express.static( path.resolve( __dirname, 'www')) );

// http://expressjs.com/en/4x/api.html#app.listen
let server = http.createServer(app)
server.listen(() => {
	let serverPort = server.address().port

	data = data.map((entry) => {
		entry.page = entry.page
								.split('http://localhost')
								.join('http://localhost:' + serverPort)
		return entry
	})


	console.log('Server started at ', server.address().port) //process.argv[2]

	Recorder.record(data).then((e, result) => {
		server.close()
		process.exit(0)
	})
})
