

function isServerNeeded (data) {
  data.forEach((entry) => {
    // local page?
    if (!entry.page.match(/http[s]*:\/\//)) {
      // check it path is not absolute
        return true;
    }
  })
  return false;
}



function getAdjustedModelURL(data, expressApp, serverPort) {

  var expressStaticOptions = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: ['index.html', 'index.htm'],
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now())
    }
  }

  expressApp.use((req, res, next) => {
    //TODO: avoid using file:/// protocols;
    // extract the encoded path; localhost[/ENCODED_PATH]
    req.url = decodeURIComponent(req.url.substring(1))
    console.log(req.url)
    next()
  })


  return data.map((entry) => {
    // local page?
    if (!entry.page.match(/http[s]*:\/\//)) {
      // check it path is not absolute
      if (!entry.page.match(/[^\:]*:|^\/^\\/)) {
        //TODO: parentDirectory
        entry.page = path.join(process.cwd(), entry.page)
        //TODO:encode
      }

      // use parent directory
      // http://expressjs.com/en/api.html#example.of.express.static
      let parentDirectory = path.dirname(entry.page)
      expressApp.use(parentDirectory, express.static(parentDirectory, expressStaticOptions))
      entry.page = `http://localhost:${serverPort}/${encodeURI(entry.page)}` //encodeURIComponent
    }

    return entry
  })
}

module.exports = {
  isServerNeeded,
  getAdjustedModelURL
}
