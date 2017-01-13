var d3 = require('d3');

global.d3 = d3;

var jsdom = require('jsdom');
var fs = require('fs');

/**
 * Run a d3-using function using JSDOM rather than a browser-native DOM.
 * JSDOM lacks some important rendering functions. It cannot, for instance,
 * interpolate along a path or getBBox() on an element. Those require a full
 * rendering engine. However, JSDOM can still help support some D3 generation
 * and unittesting of code that doesn't require rendering support.
 */
function serverSideD3(func) {
	jsdom.env({
    html: '',
    features: { QuerySelector: true },
    scripts: [], // e.g. "file://"+__dirname+"/d3.min.js" for local script
    done: function(errors, window) {
      // configure globals
      // get d3 into dom, dom into document globals
      window.d3 = d3.select(window.document);
      global.document = window.document;

      // do d3 stuff
      func();
    }
	});
}

/**
 * Write out the contents of the .container div
 */
function writeContentsToFile(outpath, container='.container') {

  var contents = d3.select(container).html();
  fs.writeFileSync(outpath, contents);
}

/**
 * Draw a circle, emit the file.
 */

function drawAndWrite(func, outpath='test.svg', container='body') {
  serverSideD3(function(){
    func();
    writeContentsToFile(outpath, container);
  });
}

exports = module.exports = {
  serverSideD3,
  drawAndWrite
};
