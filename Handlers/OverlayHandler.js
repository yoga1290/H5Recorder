
const { colorKey } = require('../ffmpegUtil')

/*
[{
  scale, colorkey, similarity, video
}]
*/
function handle(entries, cb) {
  let cmds = []
  entries.forEach((entry, i) => {

    if (entry.overlay) {

      var filters = ''
      var videoStreams = []
      entry.overlay.forEach((overlay, j) => {
        videoStreams.push(overlay.video)
        filters +=
        `[${j+1}] ${overlay.scale}[scaled${j+1}] ;\
        [scaled${j+1}] colorkey=color=${overlay.colorkey ? overlay.colorkey:'green'}:similarity=${entry.overlay.similarity} [keyed${j+1}];\
        [0][keyed${j+1}]overlay;`
      })

      let cmd = `ffmpeg \
          -i v${i}.mp4 \
          ${videoStreams.map((s)=>{return ' -i' + s})} \
          -filter_complex "${filters}" -y sub${i}.mp4`.split('\t').join('')


    }
  })
}


// Making APIs that support both callbacks and promises
// RE: https://developer.ibm.com/node/2016/08/24/promises-in-node-js-an-alternative-to-callbacks/
exports.handleOverlay = function (entries, cb) {
  if (cb) return handle(entries, cb)

  return new Promise(function (resolve, reject) {
    handle(entries, function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
}
