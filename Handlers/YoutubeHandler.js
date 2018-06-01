const { youtube, deleteFiles } = require('../ffmpegUtil')


function downloadVideo(videoId) {
  return new Promise(resolve => {
    youtube(videoId, resolve)
  });
}

function handle(entries, callback) {

  let filesToDelete = []
  entries.forEach( (entry, i) => {
    if (entry.youtube) {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
      downloadVideo(entry.youtube).then((fout) => {
        filesToDelete.push(fout)
        entries[i]['video'] = fout
      })
    }
  })

  callback(entries)
  deleteFiles(filesToDelete) //TODO await
}



// Making APIs that support both callbacks and promises
// RE: https://developer.ibm.com/node/2016/08/24/promises-in-node-js-an-alternative-to-callbacks/
module.exports = function (data, cb) {
  if (cb) return handle(data, cb)

  return new Promise( (resolve, reject) => {

    handle(videoId, function (err, data) {
      if (err) return reject(err)
			console.log('youtube video downloaded:', err, data)
      resolve(data)
    })

  })
}
