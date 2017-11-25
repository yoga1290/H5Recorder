const { exec } = require('child_process');
const express = require('express');
const http = require('http')
const path = require('path');
var app = express();



let segments = []

if (process.argv[2]) {
	segments = require(`./${process.argv[2]}`)
} else {
	console.log('Usage: npm start PATH_TO_DATA.json (try "npm start sample.json")')
	process.exit(0)
}


let phantomScript = 'phantomjs record.phantom.js'
let ffmpeg = '| ffmpeg -y -c:v png -f image2pipe -r 24 -t 8  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart'
let serverPort = 8080;
let loop = (i) => {

	let phantomScriptParameters = [
		serverPort,
		segments[i].page,
		segments[i].startHash,
		segments[i].endHash
	].join(' ')

	let cmd = [
		phantomScript,
		phantomScriptParameters,
		ffmpeg,
		'v' + i + '.mp4'
	].join(' ')

	console.log('executing', cmd)
	exec(cmd, (err, stdout, stderr) => {
		if (err) {
			// node couldn't execute the command
			console.log('error', err)
			return;
		}

		// the *entire* stdout and stderr (buffered)
		console.log(`stdout: ${stdout}`);
		console.log(`stderr: ${stderr}`);
		// app.exit()
		i++
		if (i >= segments.length) {
			process.exit(0)
		} else {
			loop(i)
		}
	});
}


app.set('port', (process.env.PORT || 8080));
app.use(express.static( path.resolve( __dirname, 'www')) );

// http://expressjs.com/en/4x/api.html#app.listen
let server = http.createServer(app)
server.listen(() => {
	serverPort = server.address().port
	console.log('Server started at ', server.address().port) //process.argv[2]
	loop(0)
})
