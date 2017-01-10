
// const d3 = require('d3');
const parse = require('./parse');


/**
 * Extended attribute setting. Combines d3's
 * .attr() and .attrs() with extended string
 * parsing.
 */
function attrx(...args) {
  var selection = this;

  if (args.length === 1) {
    var map = args[0];
    var mapType = typeof map;

    if (mapType === 'string')
      map = parse.attrParse(map);

    for (var name in map) {
      selection.attr(name, map[name]);
    }
    return selection;
  } else {
    // more than one
    // handle .attrx(name, static value)
    // handle .attrx(name, function)
    // handle .attrx(name1, value1, name2, value2, ...)
    // handle .attrx(name1, function1, name2, function2, ...)

    var rendered = {};

    for (var i=0; i<args.length; i++) {
      var ap = parse.attrParse(args[i]);
      Object.assign(rendered, ap);
      var apkeys = Object.keys(ap);
      var lastkey = apkeys[apkeys.length-1];
      if (ap[lastkey] === undefined) {
        rendered[lastkey] = args[i+1];
        i += 1;
      }
    }


  }
}
  // FIXME: missing functional support
  // FIXME: missing multi-arg support


/**
 * Extended style attribute setting. Combines d3's
 * .style() and .styles() with extended string
 * parsing.
 */
function stylex(map) {
  var selection = this;
  var mapType = typeof map;

  if (mapType === 'string')
    map = parse.attrParse(map);
  for (var name in map) {
    selection.style(name, map[name]);
  }
  return selection;

  // FIXME: missing functional support
  // FIXME: missing multi-arg support

}


function appendx(selector) {
  var self = this;
  var toAdd = parse.eltParse(selector);
  self = self.append(toAdd.element || 'div');
  for (var key in toAdd) {
    if (key === 'element') continue;
    self.attr(key, toAdd[key]);
  }
  return self;
}

function insertx(selector) {
  var self = this;
  var toAdd = parse.eltParse(selector);
  self = self.insert(toAdd.element || 'div');
  for (var key in toAdd) {
    if (key === 'element') continue;
    self.attr(key, toAdd[key]);
  }
  return self;
}


// link into D3 selection functions
var methods = { appendx, insertx, attrx, stylex };
var methodKeys = Object.keys(methods);

methodKeys.forEach(k => d3.selection.prototype[k] = methods[k]);
// Object.assign(d3.selection.prototype, methods);

// for v3 also extend enter selection
if (d3.version.charAt(0) === '3') {
  methodKeys.forEach(k => d3.selection.enter.prototype[k] = methods[k]);
  // Object.assign(d3.selection.enter.prototype, methods);
}

if (typeof module === 'undefined')
  module = {};

// most exports are bound into d3, not used on their own
exports = module.exports = {};
