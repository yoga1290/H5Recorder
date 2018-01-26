
/*
[{
  scale, colorkey, similarity, video
}]
*/
function colorkey(entry, original, output) {

  if (entry.overlay) {
    console.log('Overlay', 'has entries', entry.size.w, entry.size)
    var filters = []
    var videoStreams = []

    var recordedPageStream = '0'

    entry.overlay.forEach((overlay, j) => {
      console.log('Overlay', 'entry', overlay)
      var aspectRatio = (overlay.crop && overlay.crop.aspectRatio) ? overlay.crop.aspectRatio : (16/9)

      var offsetX = (overlay.crop && overlay.crop.offset && overlay.crop.offset.x) ? overlay.crop.offset.x : 0
      var offsetY = (overlay.crop && overlay.crop.offset && overlay.crop.offset.y) ? overlay.crop.offset.y : 0
      var cKey = overlay.colorkey ? overlay.colorkey:'green'
      var similarity = overlay.similarity ? overlay.similarity:1

      var startTime = (overlay.time && overlay.time.start) ? overlay.time.start:false
      var endTime = Math.max(startTime, (overlay.time && overlay.time.end) ? overlay.time.end:false)
      var timeFilter = startTime ? `-ss ${startTime}`:''
          timeFilter += endTime ? ` -t ${endTime - startTime}`:''

      videoStreams.push(`${timeFilter} -i ${overlay.video}`)

      filters.push(
      `[${j+1}]crop=\
        min(iw-iw*${offsetX}\\,(ih-ih*${offsetY})*${aspectRatio}): \
        min(ih-ih*${offsetY}\\, (iw-iw*${offsetX})*${1/aspectRatio}) \
        :iw*${offsetX}:ih*${offsetY}  [cropped${j+1}];\
      [cropped${j+1}]scale=\
        w=iw*min(${entry.size.w}/iw\\,${entry.size.h}/ih): \
        h=ih*min(${entry.size.w}/iw\\,${entry.size.h}/ih): \
        force_original_aspect_ratio=decrease,setsar=1,\
        pad=${entry.size.w}:${entry.size.h}:(${entry.size.w}-iw)/2:(${entry.size.h}-ih)/2[scaled${j+1}];\
      [${recordedPageStream}]colorkey=color=${cKey}:similarity=${similarity} [keyed${j+1}];\
      [scaled${j+1}][keyed${j+1}]overlay ${(j+1<overlay.length) ? ('['+ recordedPageStream + ']'):''}`)
      recordedPageStream++
    })

    return `ffmpeg \
        -i ${original} \
        ${videoStreams.join(' ')} \
        -filter_complex "${filters.join(';')}" -y ${output}`.split('\t').join('')
  }

  return null
}

module.exports = colorkey;
