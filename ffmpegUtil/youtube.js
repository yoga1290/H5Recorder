var request = require("request");
var exec = require('child_process').exec;
var fs = require("fs");

function handle(videoId, callback) {

		request({
		  uri: "https://m.youtube.com/watch?v=" + videoId,
		  method: "GET",
		  // timeout: 10000,
		  // followRedirect: true,
		  // maxRedirects: 10,
		  headers: {
		    'Accept': '*/*',
		    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1'
		  }
		}, function(error, response, body) {
		  // console.log(response.headers);
		  // console.log(response.headers['content-type']);


		  var r = response.body;
		   r = r.substring(r.indexOf('url_encoded_fmt_stream_map'),r.length);
		   r = r.substring(r.indexOf('url=http')+4,r.length);
		   r = r.split('url=');
		   r = decodeURIComponent(r[0].substring(0,r[0].indexOf('\\\\')));
		   if (r.indexOf(',') > -1) {
		     r = r.substring(0,r.indexOf(','));
		   }

		console.log(r);

		// exec("curl -Lo test.mp4 '" + r + "' \
		// -XGET \
		// -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' \
		// -H 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1'");


		  var req = request({
		    uri: r,
		    method: "GET",
		    followRedirect: true,
		    headers: {
		      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A300 Safari/602.1',
		      'Accept': '*/*',
		      'Accept-Encoding':'gzip, deflate'
		    }
		  }, function(error, res, body) {

        if (error) {
          callback(error) //TODO
        }
		    //206
		    // res.pipe(fs.createWriteStream('testNode.mp4'));
		    // console.log(response2.headers);
		    // console.log(response.headers['content-type']);
		  });

		  req.on('response',  function (res) {
		    res.pipe(fs.createWriteStream(videoId + '.mp4'));
        callback(null, videoId + '.mp4')
		  });



		});

}



// Making APIs that support both callbacks and promises
// RE: https://developer.ibm.com/node/2016/08/24/promises-in-node-js-an-alternative-to-callbacks/
module.exports = function (videoId, cb) {
  if (cb) return handle(videoId, cb)

  return new Promise( (resolve, reject) => {

    handle(videoId, function (err, data) {
      if (err) return reject(err)
			console.log('youtube video downloaded:', err, data)
      resolve(data)
    })

  })
}
