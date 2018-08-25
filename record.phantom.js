// https://gist.github.com/phanan/e03f75082e6eb114a35c#file-runner-js

// Run this from the commandline:
// phantomjs runner.js | ffmpeg -y -c:v png -f image2pipe -r 24 -t 10  -i - -c:v libx264 -pix_fmt yuv420p -movflags +faststart output.mp4
const system = require('system')

// address#startHash#endHash#w#h
var params = system.args[1].split('#')

console.log('hash=', params);
var address = params[0];
var startRecordHash = params[1];
var endRecordHash = params[2];
var width = parseInt(params[3]);
var height = parseInt(params[4]);

console.log('hash=', system.args, params);

var page = require('webpage').create(),
    // address = 'http://localhost:' + serverPort + '/' + pagePath,
    // duration = 3, // duration of the video, in seconds
    framerate = 24, // number of frames per second. 24 is a good value.
    counter = 0;

page.viewportSize = { width: width, height: height };

var record = false;
var timeup = false;
window.setTimeout(function () {
  timeup = true;
}, 10000);

// http://phantomjs.org/api/webpage/handler/on-url-changed.html
page.onUrlChanged = function(targetUrl) {
  if (targetUrl.match('#' + startRecordHash) !== null) {
    record = true;
  } else if (record && targetUrl.match('#' + endRecordHash) !== null || timeup) {
    record = false;
    phantom.exit(0);
  }
};

var cnt = 0
page.open(address, function(status) {
    if (status !== 'success') {
        console.error('Unable to load the address!');
        phantom.exit(1);
    } else {
        window.setTimeout(function () {
            page.clipRect = { top: 0, left: 0, width: width, height: height };

            window.setInterval(function () {
                if (record) {
                  page.render('/dev/stdout', { format: 'png' });
                  // page.render('/process/stdout/write', { format: 'png' });
                  // phantom.exit(0)
                  // page.render('screenshot' + cnt++, { format: 'png' });
                }
            }, 1/framerate);
        }, 200);
    }
});
//*/
