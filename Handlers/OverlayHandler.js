const { exec } = require('child_process');
const { colorKey } = require('../ffmpegUtil')

function handle(entries, inputs, cb) {
console.log('Overlay', entries, inputs)
//cb()
// /*
  let loop = (i) => {

  	let cmd = colorKey(entries[i], inputs[i], `sub${i}.mp4`)

    if (cmd) {
      console.log('overlay', 'executing', cmd)
      exec(cmd, (err, stdout, stderr) => {
    		if (err) {
    			// node couldn't execute the command
    			console.error('error', err)
          cb(err)
    			return;
    		}

    		// the *entire* stdout and stderr (buffered)
    		console.log(`stdout: ${stdout}`);
    		console.error(`stderr: ${stderr}`);
    		// app.exit()

    		if (i + 1 >= entries.length) {
    			if (cb) {
            cb(null, {})
  					//TODO:
          }
    		} else {
    			loop(i + 1)
    		}
    	});

    } else if (i < entries.length) {
      loop(i + 1)
    } else {
      cb(null, {})
    }

  }

  if (entries.length > 0) {
    loop(0)
  }
//*/
}


// Making APIs that support both callbacks and promises
// RE: https://developer.ibm.com/node/2016/08/24/promises-in-node-js-an-alternative-to-callbacks/
exports.handleOverlay = function (entries, inputs, cb) {
  if (cb) return handle(entries, inputs, cb)

  return new Promise(function (resolve, reject) {
    handle(entries, inputs, function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
