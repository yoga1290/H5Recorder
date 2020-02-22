const { exec } = require('child_process');
const path = require('path');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path
const phantomjsPath = require('phantomjs-bin').path;
const { H5R_OUTPUT_DIR } = process.env;
const outputdir = path.resolve(__dirname, H5R_OUTPUT_DIR);

function getCmd(entry, runInCmd = false, output) {
  //-framerate 1 -i - -c:v libx264 -vf format=yuv420p //
  //       --extra-cflags=-fPIC \

	// ffmpeg -y -c:v png -f image2pipe -r 24 -t 8  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart
	// let phantomModulePath = path.join(__dirname, '../', '../', '../', 'node_modules', 'phantomjs-prebuilt', 'bin', 'phantomjs');
	// let phantomPathInCmd = path.join(__dirname, '../', 'node_modules', 'phantomjs-prebuilt', 'bin', 'phantomjs');

	// let panthomPath = runInCmd ? phantomPathInCmd:phantomModulePath;
	let phantomScriptPath = path.join(__dirname, '../', 'record.phantom.js');

	return `${phantomjsPath} ${phantomScriptPath} \
"${entry.page}#${entry.startHash}#${entry.endHash}#${entry.size.w}#${entry.size.h}" \
		| ${ffmpeg} \
		-c:v png \
		-f image2pipe \
		-r 24  \
		-i - \
		-c:v libx264 \
		-pix_fmt yuv420p \
		-movflags +faststart \
		-y ${output};`.split('\t').join('')
}

function handle(entries, runInCmd, cb) {
console.log('TODO')
//cb()
// /*
	let outputs = []
  let loop = (i) => {

		let output = path.resolve(outputdir, `v${new Date().getTime() + '-' + i}.mp4`);
  	let cmd = getCmd(entries[i], runInCmd, output)
  	console.log('recorder', 'executing', cmd)

		let to = -1;
  	let task = exec(cmd, (err, stdout, stderr) => {

			clearTimeout(to)
			outputs.push(output)

			console.log(`stdout: ${stdout}`);
			console.error(`stderr: ${stderr}`);

			if (err) {
  			// node couldn't execute the command
  			console.error('error', err)
				cb(err, outputs)
  			return;
  		}

  		// the *entire* stdout and stderr (buffered)
  		// app.exit()
  		if (i + 1 >= entries.length) {
  			if (cb) {
					console.log('recorder', outputs.join(', '))
          cb(null, outputs)
					//TODO:
        }
  		} else {
  			loop(i + 1)
  		}
  	});

		to = setTimeout(() => {
			console.log('PROCESS KILLED', outputs);
			task.kill()
			cb(null, outputs)
		}, 60000) //TODO config?

  }
  loop(0)
//*/
}

// Making APIs that support both callbacks and promises
// RE: https://developer.ibm.com/node/2016/08/24/promises-in-node-js-an-alternative-to-callbacks/
module.exports = function (entries, runInCmd = false, cb) {
  if (cb) return handle(entries, runInCmd, cb)

  return new Promise( (resolve, reject) => {

    handle(entries, runInCmd, function (err, data) {
      if (err) return reject(err)
			console.log('recorder promise', err, data)
      resolve(data)
    })

  })
}
