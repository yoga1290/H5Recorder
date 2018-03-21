const ffmpeg = require('@ffmpeg-installer/ffmpeg').path

function crop(input, output, w=1, h=1, x=1, y=1) {
  return `${ffmpeg} \
-y \
-i ${input} \
-filter:v "crop=iw*${w}:ih*${h}:${x}:${y}" \
-c:a copy \
${output}`
}

module.exports = crop;
