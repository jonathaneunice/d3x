(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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

},{"./parse":2}],2:[function(require,module,exports){
/**
 * parse - foundation attribute parsing functions
 *         for d3x extended methods
 */

/**
 * Parse an element with CSS selector style id, class,
 * and key=value annotations.
 *
 * E.g. cssi('div#one.two.three')
 * yields { element: 'div',
 *          id: 'one',
 *          class: 'two three',
 *        }
 */
function eltParse (s) {
  s = s.trim();
  var eltM = s.match(/^\w+/);
  var idM = s.match(/#(\w+)/);
  var classM = s.match(/\.(\w+)/g);
  var attrM = s.match(/\[[^\]]*?\]/g);
  var res = {};
  if (eltM && eltM.length) res.element = eltM[0];
  if (idM && idM.length)   res.id  = idM[1];
  if (classM && classM.length)
    res.class = classM.map(s => s.slice(1)).join(' ');
  if (attrM && attrM.length) {
    attrM.forEach(a => {
      var insides = a.slice(1,-1); // take off [ and ]
      // piggyback attrParse()'s attribute parsing ability
      Object.assign(res, attrParse(insides));
    });
  }
  return res;
}


/**
 * Like String.prototype.indexOf(), except instead of a single
 * searchValue, accepts an array of searchValues. Returns the minimum
 * index of all such searchValues, or -1 if none exists. Search can be
 * started at position fromIndex.
 */
function indexOfAny(s, searchValues, fromIndex) {
  var indices = searchValues.map(sv => s.indexOf(sv, fromIndex))
                            .filter(i => i >= 0);
  if (indices.length === 0) return -1;
  return Math.min(...indices);
}

function isWhitespace(s) {
  return /^\s+$/.test(s);
}

const quoteChars = [`'`, `"`];

function isQuote(s) {
  return quoteChars.indexOf(s) >= 0;
}

/**
 * Parse attribute strings.
 *
 * Uquoted: x=1 y=3
 * Quoted:  x="1 and 2" y='3'
 * Partial: x=
 * Partial: x
 * CSS style: x: 1; y: 3
 * CSS style quoted: x: "1 and 2"; y: '3'
 */
function attrParse (s) {
  s = s.trim();
  var res = {};
  const equalsChars = ['=', ':'];

  var cursor = 0;
  while (cursor < s.length) {
    var assignIndex = indexOfAny(s, equalsChars, cursor);
    if (assignIndex === -1) {
      var remaining = s.slice(cursor).trim();
      if (remaining) {
        res[remaining] = undefined;
      }
      return res;
    }
    var left = s.slice(cursor, assignIndex).trim();
    var rcursor = assignIndex + 1;
    // find the non-whitespace rhs of the attribute definition
    while ((rcursor < s.length) && (isWhitespace(s[rcursor]))) {
      rcursor++;
    }
    if (rcursor >= s.length) {
      res[left] = undefined;
      return res;
    } else if (isQuote(s[rcursor])) {
      // find the end of quote as boundary of value
      var endQuoteIndex = s.indexOf(s[rcursor], rcursor+1);
      res[left] = s.slice(rcursor+1, endQuoteIndex);
      cursor = endQuoteIndex+1;
    } else {
      // no quote value, ends with whitespace or ;
      var endValueIndex = indexOfAny(s, [';', ' ', '\t', '\n'], rcursor+1);
      if (endValueIndex < 0) endValueIndex = s.length;
      res[left] = s.slice(rcursor, endValueIndex);
      cursor = endValueIndex+1;
    }
  }
  return res;
}


if (typeof module === 'undefined')
  module = {};

exports = module.exports = {
  indexOfAny,
  isWhitespace,
  isQuote,
  eltParse,
  attrParse
};

},{}]},{},[1]);
