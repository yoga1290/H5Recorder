const { exec } = require('child_process');


function getCmd(entry, output) {
  //-framerate 1 -i - -c:v libx264 -vf format=yuv420p //
  //       --extra-cflags=-fPIC \

	// ffmpeg -y -c:v png -f image2pipe -r 24 -t 8  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart
	return `phantomjs record.phantom.js \
		${entry.page} \
		${entry.startHash} \
		${entry.endHash} \
	| ffmpeg \
			-c:v png \
			-f image2pipe \
			-r 24  \
			-i - \
			-c:v libx264 \
			-pix_fmt yuv420p \
			-movflags +faststart \
			-y ${output};`.split('\t').join('')
}

let i = 0
function handle(entries, cb) {
console.log('TODO')
//cb()
// /*
  let loop = (i) => {

  	let cmd = getCmd(entries[i], `v${i}.mp4`)
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
  		if (i >= entries.length) {
  			if (cb) {
          cb(null, {})
					//TODO:
        }
  		} else {
  			loop(i)
  		}
  	});
  }
  loop(0)
//*/
}

// Making APIs that support both callbacks and promises
// RE: https://developer.ibm.com/node/2016/08/24/promises-in-node-js-an-alternative-to-callbacks/
exports.record = function (entries, cb) {
  if (cb) return handle(entries, cb)

  return new Promise(function (resolve, reject) {
    handle(entries, function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
