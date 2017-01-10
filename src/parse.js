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
