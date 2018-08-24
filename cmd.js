#!/usr/bin/env node
const fs = require('fs');
const h5recorder = require('./index.js');


if (process.argv[2]) {
	let infile = process.argv[2]
	fs.readFile(infile, function read(err, config) {
	    if (err) {
	        throw err;
	    }
console.log('config', infile, config)
			h5recorder(config, true).then((result) => {
				console.log("OK", result)
			}, (err) => {
				console.log("error", err)
			})
	})

} else {
	console.log(`Usage: PATH_TO_DATA.json`)
	process.exit(0)
}
