const ffmpeg = require('@ffmpeg-installer/ffmpeg').path

/**
 * Returns FFMPEG command-line string
 * @param {Array} infiles - input file paths
 * @param {string} output - output file path
 * @param {number} w - w
 * @param {number} h - h
 * @param {number} x - x
 * @param {number} y - y
 */
function crop(input, output, w=1, h=1, x=1, y=1) {
  return `${ffmpeg} \
-y \
-i ${input} \
-filter:v "crop=iw*${w}:ih*${h}:${x}:${y}" \
-c:a copy \
${output}`
}

module.exports = crop;
