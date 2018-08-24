const { exec } = require('child_process');
const path = require('path');
const ffmpeg = require('@ffmpeg-installer/ffmpeg').path


function getCmd(entry, output) {
  //-framerate 1 -i - -c:v libx264 -vf format=yuv420p //
  //       --extra-cflags=-fPIC \

	// ffmpeg -y -c:v png -f image2pipe -r 24 -t 8  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart
	let phantomPath = path.join(__dirname, '../', '../', '../', 'node_modules', 'phantomjs-prebuilt', 'bin', 'phantomjs');
	let phantomScriptPath = path.join(__dirname, '../', 'record.phantom.js');

	return `${phantomPath} ${phantomScriptPath} \
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

function handle(entries, cb) {
console.log('TODO')
//cb()
// /*
	let outputs = []
  let loop = (i) => {

		let output = `v${new Date().getTime() + '-' + i}.mp4`
  	let cmd = getCmd(entries[i], output)
  	console.log('recorder', 'executing', cmd)
  	exec(cmd, (err, stdout, stderr) => {
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
  }
  loop(0)
//*/
}

// Making APIs that support both callbacks and promises
// RE: https://developer.ibm.com/node/2016/08/24/promises-in-node-js-an-alternative-to-callbacks/
module.exports = function (entries, cb) {
  if (cb) return handle(entries, cb)

  return new Promise( (resolve, reject) => {

    handle(entries, function (err, data) {
      if (err) return reject(err)
			console.log('recorder promise', err, data)
      resolve(data)
    })

  })
}
