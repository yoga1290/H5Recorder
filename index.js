/**
* The main module
* @module H5Recorder
*/

const { exec } = require('child_process');
const express = require('express');
const http = require('http')
const path = require('path');
const fs = require('fs');
const Ajv = require('ajv');
const schema = require('./schema.json')
const {
		Recorder,
 		OverlayHandler,
  	MergeHandler,
		AMergeHandler,
	 	LocalPageServer } = require('./Handlers')
const {
	isServerNeeded,
	getAdjustedModelURL } = LocalPageServer

var app = express();



let data = []
let ajv = new Ajv()
let jsonSchemaValidator = ajv.compile(schema)
let port = process.env ? (process.env.PORT||0) : 0;
// If port is omitted or is 0, the operating system will assign an arbitrary unused port, which can be retrieved by using server.address().port after the 'listening' event has been emitted.
// see https://nodejs.org/api/net.html#net_server_listen_port_host_backlog_callback

// https://github.com/wekan/wekan/wiki/REST-API-Swimlanes

/**
 * Executes the process: data ->(Recorder-> OverlayHandler-> MergeHandler-> MergeHandler)-> callback
 * @param {Object} data - data
 * @param {boolean} runInCmd - runInCmd
 * @param {boolean} callback - callback
 // * @exports process -
 */
function process(data, runInCmd, callback) {
	let outputs = []
	Recorder(data, runInCmd).then((screenRecords) => {
		// console.log('recorder/screenRecords', screenRecords)
		OverlayHandler(data, screenRecords).then((overlayOutputs) => {

			MergeHandler(overlayOutputs).then((overlayMergeOutput) => {

				console.log('MergeHandler:', overlayMergeOutput)

				if (overlayMergeOutput.length > 0) {
					outputs.push(overlayMergeOutput)
					screenRecords.forEach(fs.unlinkSync)
					overlayOutputs.forEach(fs.unlinkSync)

					// if MergeHandler has no outputs
				} else if (overlayOutputs.length > 0) {
					outputs.push(...overlayOutputs)
					screenRecords.forEach(fs.unlinkSync)
					// if OverlayHandler has no outputs
				} else if (screenRecords.length > 0) {
					outputs.push(...screenRecords)
				}
				console.log('OUTPUTS::', outputs)

				AMergeHandler(data, outputs, (err, output) => {
					if (err) {
						callback(err)
						outputs.forEach(fs.unlinkSync)
					} else {
							console.log('final output', output)
							callback(null, output)
							outputs.forEach(fs.unlinkSync)
					}
				})

			})

		})
	}, callback)
}

/**
 * Loop over data entries, starts local server if needed then trigger the process function
 * @param {Object} data - data
 * @param {boolean} runInCmd - runInCmd
 * @param {boolean} callback - callback
 // * @exports process -
 */
function main(data, runInCmd = false, callback) {

			var valid = jsonSchemaValidator(data);
			if (!valid) {
				jsonSchemaValidator.errors.push(data)
				return callback(jsonSchemaValidator.errors, null)
			}

			if (isServerNeeded) {
				// http://expressjs.com/en/4x/api.html#app.listen
				let server = http.createServer(app)
				server.listen(port, () => {
					let serverPort = server.address().port
					data = getAdjustedModelURL(data, app, serverPort)
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
