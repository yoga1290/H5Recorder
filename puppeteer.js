const puppeteer = require('puppeteer');

//TODO validate
const params = process.argv[2].split('#')
const address = params[0];
const startRecordHash = params[1];
const endRecordHash = params[2];
const width = parseInt(params[3]);
var height = parseInt(params[4]);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(address);

/// https://github.com/GoogleChrome/puppeteer/issues/1183#issuecomment-348615375
  await page.setViewport({height, width});
  // Window frame - probably OS and WM dependent.
  height += 85;
  // Any tab.
  const {targetInfos: [{targetId}]} = await browser._connection.send(
    'Target.getTargets'
  );
  // Tab window.
  const {windowId} = await browser._connection.send(
    'Browser.getWindowForTarget',
    {targetId}
  );
  // Resize.
  await browser._connection.send('Browser.setWindowBounds', {
    bounds: {height, width},
    windowId
  });
///////////////

  let r = 24

  let _screenshotter
  let screenshotter = new Promise(resolve => {
    _screenshotter = resolve
  });
  let endScreenshotter = () => {
      _screenshotter()
  }

  let record = false
  async function updateRecordState() {
    let url = await page.evaluate('location.href')
    if (url.match(`#${startRecordHash}`) !== null) {
      record = true;
    } else if (record && url.match(`#${endRecordHash}`) !== null) {
      record = false;
      process.exit(0);
    }
  }

  let screenshotsTriggered = 0
  let screenshotsSaved = 0
  let i = setInterval(async () => {
    screenshotsTriggered++
    //TODO check/test me:
    await page.screenshot({path: '/dev/stdout', type: 'png'})
    await updateRecordState()
    // if ( screenshotsTriggered >= r) {
    //   clearInterval(i)
    // }
    if (++screenshotsSaved >= screenshotsTriggered && !record) {
      clearInterval(i)
      endScreenshotter()
      await browser.close()
    }
  }, 1000 / r)

  await screenshotter
})();
