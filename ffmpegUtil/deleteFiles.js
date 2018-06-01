const fs = require('fs')

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await

function handle(files) {
  return new Promise(resolve => {

    files.forEach((file) => {
      fs.unlinkSync(file);
    })
    resolve()
  });
}


module.exports = handle;
