const { exec } = require('child_process');
const { merge, deleteFiles } = require('../ffmpegUtil')

function handle(infiles, cb) {
    console.log('MergeHandler', infiles)
    if (infiles && infiles.length > 0) {
      let output = `${new Date().getTime()}_merge.mp4`
    	let cmd = merge(infiles, output)

      console.log('merge', 'executing', cmd)
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
    		cb(null, output)

        deleteFiles([output]) //TODO await
    	});
    } else {
      cb(null, [])
    }

}


// Making APIs that support both callbacks and promises
// RE: https://developer.ibm.com/node/2016/08/24/promises-in-node-js-an-alternative-to-callbacks/
module.exports = function (inputs, cb) {
  if (cb) return handle(inputs, cb)

  return new Promise(function (resolve, reject) {
    handle(inputs, function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
