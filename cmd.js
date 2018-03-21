#!/usr/bin/env node
const fs = require('fs');
const h5recorder = require('./index.js');


if (process.argv[2]) {
	let infile = process.argv[2]
	fs.readFile(infile, function read(err, config) {
	    if (err) {
	        throw err;
	    }

			h5recorder(config).then((result) => {
				console.log("OK")
			})
	})

} else {
	console.log(`Usage: PATH_TO_DATA.json`)
	process.exit(0)
}
