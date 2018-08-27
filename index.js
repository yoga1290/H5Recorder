const { exec } = require('child_process');
const express = require('express');
const http = require('http')
const path = require('path');
const fs = require('fs');
const Ajv = require('ajv');
const schema = require('./schema.json')
const { Recorder, OverlayHandler, MergeHandler, LocalPageServer } = require('./Handlers')
var app = express();



let data = []
let ajv = new Ajv()
let jsonSchemaValidator = ajv.compile(schema)
let port = process.env ? (process.env.PORT||0) : 0;
// If port is omitted or is 0, the operating system will assign an arbitrary unused port, which can be retrieved by using server.address().port after the 'listening' event has been emitted.
// see https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback


function process(data, runInCmd, callback) {
	let outputs = []
	Recorder(data, runInCmd).then((screenRecords) => {
		// console.log('recorder/screenRecords', screenRecords)
		OverlayHandler(data, screenRecords).then((overlayOutputs) => {
			// console.log('overlayOutputs', overlayOutputs)

			MergeHandler(overlayOutputs).then((overlayMergeOutput) => {
				console.log('MergeHandler:', overlayMergeOutput)

				if (overlayMergeOutput.length > 0) {
					outputs.push(overlayMergeOutput)
				} else if (overlayOutputs.length > 0) {
					outputs.push(...overlayOutputs)
				} else if (screenRecords.length > 0) {
					outputs.push(...screenRecords)
				}
				console.log('OUTPUTS::', outputs)
				// at the end, merge all outputs:
				MergeHandler(outputs).then((output) => {
					console.log('final output', output)
					callback(null, output)

					let filesToDelete = [...overlayOutputs, ...screenRecords, overlayMergeOutput]
					filesToDelete.forEach(fs.unlinkSync)

				})

			})
		})
	}, callback)
}

function main(data, runInCmd = false, callback) {

			if ((typeof data) !== 'array') {
				data = JSON.parse(data)
			}
			var valid = jsonSchemaValidator(data);
			if (!valid) {
				jsonSchemaValidator.errors.push(data)
				return callback(jsonSchemaValidator.errors, null)
			}

			if (LocalPageServer.isServerNeeded) {
				// http://expressjs.com/en/4x/api.html#app.listen
				let server = http.createServer(app)
				server.listen(port, () => {
					let serverPort = server.address().port
					data = LocalPageServer.getAdjustedModelURL(data, app, serverPort)
					// server.close()
					console.log('LocalPageServer: ', server.address().port) //process.argv[2]
					process(data, runInCmd, (err, result) => {
						server.close();
						callback(err, result);
					});
				})
			} else {
				process(data, runInCmd, callback);
			}

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
