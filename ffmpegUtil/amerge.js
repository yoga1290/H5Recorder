const ffmpeg = require('@ffmpeg-installer/ffmpeg').path

/**
 * Returns FFMPEG command-line string
 * @param {Array} entries - Array of Objects {path:string, [start]:number, [end]:number, [volume]:number}
 * @param {string} in_video - optional video to merge audio with
 * @param {string} output - output file path
 */
function amerge(entries, in_video = null, output) {

  return `${ffmpeg} \
    ${
      entries.map((entry, i) => {
          return `${entry.start? `-ss ${entry.start}`:''} \
                  ${entry.end? `-t ${entry.end - entry.start}`:''} \
                  -i ${entry.path}`;}).join('')
    } \
    ${in_video? ` -i ${in_video}`:''} \
    -filter_complex "${

      entries.map((entry, i) => {
            return `[${i}:a]volume=${entry.volume? entry.volume:1}[a${i}]`;
      }).join(';')

    }; ${
      entries.map((entry, i) => {
            return `[a${i}]`
      }).join('')
    } amerge[a]" ${in_video? `-c:v copy -map ${entries.length}:v`:''} -map "[a]" -strict -2 -y \
    ${output}`
}

module.exports = amerge;
