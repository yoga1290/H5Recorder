const { exec } = require('child_process');
const express = require('express');
const http = require('http')
const path = require('path');
const fs = require('fs');
const Ajv = require('ajv');
const schema = require('./schema.json')
const { Recorder, OverlayHandler, MergeHandler } = require('./Handlers')
var app = express();



let data = []
let ajv = new Ajv()
let jsonSchemaValidator = ajv.compile(schema)
let port = process.env.PORT || 0;
// If port is omitted or is 0, the operating system will assign an arbitrary unused port, which can be retrieved by using server.address().port after the 'listening' event has been emitted.
// see https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback


// http://expressjs.com/en/4x/api.html#app.listen
let server = http.createServer(app)

function main(jsonData, runInCmd = false, callback) {

	// fs.readFile(infile, function read(err, jsonData) {
	//     if (err) {
	//         throw err;
	//     }

			data = JSON.parse(jsonData)
			var valid = jsonSchemaValidator(data);
			if (!valid) {
				return callback(jsonSchemaValidator.errors, null)
			}
			var expressStaticOptions = {
			  dotfiles: 'ignore',
			  etag: false,
			  extensions: ['htm', 'html'],
			  index: ['index.html', 'index.htm'],
			  maxAge: '1d',
			  redirect: false,
			  setHeaders: function (res, path, stat) {
			    res.set('x-timestamp', Date.now())
			  }
			}


			server.listen(port, () => {
				let serverPort = server.address().port

				app.use((req, res, next) => {
					//TODO: avoid using file:/// protocols;
					// extract the encoded path; localhost[/ENCODED_PATH]
					req.url = decodeURIComponent(req.url.substring(1))
					console.log(req.url)
					next()
				})

				data = data.map((entry) => {

					// local page?
					if (!entry.page.match(/http[s]*:\/\//)) {
						// check it path is not absolute
						if (!entry.page.match(/[^\:]*:|^\/^\\/)) {
							//TODO: parentDirectory
							entry.page = path.join(process.cwd(), entry.page)
							//TODO:encode
						}

						// use parent directory
						// http://expressjs.com/en/api.html#example.of.express.static
						let parentDirectory = path.dirname(entry.page)
						app.use(parentDirectory, express.static(parentDirectory, expressStaticOptions))
						entry.page = `http://localhost:${serverPort}/${encodeURI(entry.page)}` //encodeURIComponent
					}

					return entry
				})

				// server.close()
console.log(data)
				console.log('Server started at ', server.address().port) //process.argv[2]
			//
				let outputs = []
				Recorder(data, runInCmd).then((screenRecords) => {
					// console.log('recorder/screenRecords', screenRecords)
					OverlayHandler(data, screenRecords).then((overlayOutputs) => {
						// console.log('overlayOutputs', overlayOutputs)
						server.close()

						MergeHandler(overlayOutputs).then((overlayMergeOutput) => {
							console.log('MergeHandler:', overlayMergeOutput)

							if (overlayMergeOutput.length > 0) {
								outputs.push(overlayMergeOutput)
							} else if (overlayOutputs.length > 0) {
								outputs.push(...overlayOutputs)
							} else if (screenRecords.length > 0) {
								outputs.push(...screenRecords)
							}
							// at the end, merge all outputs:
							MergeHandler(outputs).then((output) => {
								console.log('outputs', output)
								callback(null, output)
							})

						})
					})
				})

			})

	// });

}



module.exports = function (infile, runInCmd = false, cb) {
  if (cb) return main(infile, runInCmd, cb)

  return new Promise(function (resolve, reject) {
    main(infile, runInCmd, function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
