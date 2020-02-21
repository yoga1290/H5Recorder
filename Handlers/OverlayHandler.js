const { exec } = require('child_process');
const { colorKey } = require('../ffmpegUtil')
const path = require('path');
const { H5R_OUTPUT_DIR } = process.env;

function handle(entries, inputs, cb) {
console.log('Overlay', entries, inputs)
//cb()
// /*
  let outputs = []
  let loop = (i) => {

    if (i >= entries.length) {
      if (cb) {
        console.log('outputs', outputs)
        cb(null, outputs)
        //TODO:
      }
      return;
    }

    let output = path.resolve(H5R_OUTPUT_DIR, `${new Date().getTime()}_sub${i}.mp4`);
  	let cmd = colorKey(entries[i], inputs[i], output)
console.log('Overlay', 'cmd', cmd)
    if (cmd) {
      console.log('overlay', 'executing', cmd)
      exec(cmd, (err, stdout, stderr) => {
    		if (err) {
    			// node couldn't execute the command
    			console.error('error', err)
          //TODO: delete file after failure?
          cb(err)
    			return;
    		}
        outputs.push(output)
        console.log('outputs', outputs)
    		// the *entire* stdout and stderr (buffered)
    		console.log(`stdout: ${stdout}`);
    		console.error(`stderr: ${stderr}`);
    		// app.exit()

    		loop(i + 1)
    	});

    } else if (i < entries.length) {
      outputs.push(inputs[i])
      loop(i + 1)
    }

  }

  if (entries.length > 0) {
    loop(0)
  }
//*/
}


// Making APIs that support both callbacks and promises
// RE: https://developer.ibm.com/node/2016/08/24/promises-in-node-js-an-alternative-to-callbacks/
module.exports = function (entries, inputs, cb) {
  if (cb) return handle(entries, inputs, cb)

  return new Promise(function (resolve, reject) {
    handle(entries, inputs, function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
