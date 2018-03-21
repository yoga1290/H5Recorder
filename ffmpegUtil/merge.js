function merge(infiles, output) {
  return `ffmpeg \
  ${infiles.map((infile) => {return `-i ${infile} `;}).join('')} \
  -filter_complex "concat=n=${infiles.length}:v=1" \
  ${output}`
}

module.exports = merge;
