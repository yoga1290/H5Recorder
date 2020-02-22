const { exec } = require('child_process');
const { amerge } = require('../ffmpegUtil')
const path = require('path');
const { H5R_OUTPUT_DIR } = process.env;

function handle(entries, inVideos, cb) {
console.log('AMergeHandler', entries, inVideos)
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
    // every entry outputs a video but not all have audio object
    if (entries[i].audio && entries[i].audio.length > 0) {
      let output = path.resolve(H5R_OUTPUT_DIR, `${new Date().getTime()}_amerge.mp4`);
      let cmd = amerge(entries[i].audio, inVideos[i], output)
      outputs.push(output)

      console.log('AMergeHandler', 'executing', cmd)
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
        loop(i + 1)
    	});
    } else if (i < entries.length) {
      // every entry outputs a video but not all have audio object
      outputs.push(inVideos[i])
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
