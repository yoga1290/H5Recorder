const ffmpeg = require('@ffmpeg-installer/ffmpeg').path

/**
 * Returns FFMPEG command-line string
 * @param {string} output - output file path
 * @param {Array} videos - ...in flated list of videos
 */
function concat(output, ...videos) {
  var videoList = '',
      filtermap = ''
  videos.forEach((video, i) => {
    videoList += `-i ${video} `
    filtermap += `[${i}:v:0][${i}:a:0]`
  })
  return `${ffmpeg} \
  ${videoList}
  -filter_complex \
  "${filtermap}\
  concat=n=${videos.length}:v=1:a=1\
  [outv][outa]" \
  -map "[outv]" \
  -map "[outa]" \
  -y \
  ${output}`
}
