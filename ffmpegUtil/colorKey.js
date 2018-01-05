
const SCALE = ''

function colorKey(
  video1, video2, output,
  color1='green', scale=SCALE, similarity=0.7) {

  return
`ffmpeg \
-i ${video1} \
-i ${video2} \
-filter_complex \
"[0] ${scale}[in0] ;\
"[1] ${scale}[in1] ;\
[in0] colorkey=color=${color1}:similarity=${similarity} [keyed];\
[in1][keyed]overlay" \
-y \
${output}`
}

module.exports = colorkey;
