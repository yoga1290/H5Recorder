const ffmpeg = require('@ffmpeg-installer/ffmpeg').path

/**
 * Returns FFMPEG command-line string
 * @param {Array} audio - Array of Objects {path:string, [start]:number, [end]:number, [volume]:number}
 * @param {string} in_video - optional video to merge audio with
 * @param {string} output - output file path
 */
function amerge(audio, in_video = null, output) {

  //TODO: fix the silent audio issue

  if (audio.length > 0) {
    return `${ffmpeg} \
      ${
        audio.map((entry, i) => {
            return `${entry.start? ` -ss ${entry.start} `:''} \
                    ${entry.end? ` -t ${entry.end - entry.start} `:''} \
                    -i ${entry.path} `;}).join('')
      } \
      ${in_video? ` -i ${in_video}`:''} \
      -filter_complex "${

        audio.map((entry, i) => {
              return `[${i}:a]volume=${entry.volume? entry.volume:1}[a${i}]`;
        }).join(';')

      }; ${
        audio.map((entry, i) => {
              return `[a${i}]`
        }).join('')
        //  amerge=inputs=${audio.length}[a]
      } amix=inputs=${audio.length}:duration=longest[a]" \
      -c:v copy -map ${audio.length}:v \
      -map '[a]' -strict -2 \
      -y ${output}`
  }
  return false
}

module.exports = amerge;
