const ffmpeg = require('@ffmpeg-installer/ffmpeg').path

/**
 * Returns FFMPEG command-line string
 * @param {Array} infiles - input file paths
 * @param {string} output - output file path
 */
function merge(infiles, output) {
  return `${ffmpeg} \
  ${infiles.map((infile) => {return `-i ${infile} `;}).join('')} \
  -filter_complex "concat=n=${infiles.length}:v=1" \
  ${output}`
}

module.exports = merge;
