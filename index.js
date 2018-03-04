const { exec } = require('child_process');
const express = require('express');
const http = require('http')
const path = require('path');
const { Recorder, OverlayHandler } = require('./Handlers')
var app = express();



let data = []


app.set('port', (process.env.PORT || 8080));

// http://expressjs.com/en/4x/api.html#app.listen
let server = http.createServer(app)

function main(www, infile, callback) {

	fs.readFile(infile, function read(err, jsonData) {
	    if (err) {
	        throw err;
	    }

			data = JSON.parse(jsonData)
			app.use(express.static(www))

			server.listen(() => {
				let serverPort = server.address().port

				data = data.map((entry) => {
					entry.page = entry.page
											.split('http://localhost')
											.join('http://localhost:' + serverPort)
					return entry
				})


				console.log('Server started at ', server.address().port) //process.argv[2]

				Recorder.record(data).then((screenRecords) => {
					console.log('recorder/screenRecords', screenRecords)
					OverlayHandler.handleOverlay(data, screenRecords).then((e, result) => {
						server.close()
						callback()
					})
				})

			})

	});

}



module.exports = function (entries, inputs, cb) {
  if (cb) return main(entries, inputs, cb)

  return new Promise(function (resolve, reject) {
    main(entries, inputs, function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
