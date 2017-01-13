var d3 = require('d3');
var serverd3 = require('./serverd3');

global.d3 = d3;

var d3x = require('../src/d3x');

var assert = require('chai').assert;
var cl = console.log;

var chartWidth = 500,
    chartHeight = 500;

var colours = 'red green blue orange purple yellow brow'.split(' ');

/**
 * Test D3 function. Draw a circle.
 */
function drawCircle() {
  var svg = d3.select('body')
              .append('div').attr('class','container') //make a container div to ease the saving process
              .append('svg')
                .attr('xmlns', 'http://www.w3.org/2000/svg')
                  .attr('width',  chartWidth)
                  .attr('height', chartHeight);

  var c = svg.append('circle')
      .attr('cx', chartWidth/2)
      .attr('cy', chartHeight/2)
      .attr('r', chartWidth/3)
      .attr('fill', 'blue');
}

function drawCircleX() {
  var svg = d3.select('body')
              .appendx('div.container') //make a container div to ease the saving process
              .append('svg')
                .attrx('xmlns=http://www.w3.org/2000/svg')
                .attr('width',  chartWidth)
                .attr('height', chartHeight);

  var c = svg.append('circle')
      .attr('cx', chartWidth/2)
      .attr('cy', chartHeight/2)
      .attr('r', chartWidth/3)
      .attr('fill', 'blue');
}


function drawCircleX1() {
  var svg = d3.select('body')
              .appendx('div.container') //make a container div to ease the saving process
              .append('svg')
                .attrx('xmlns=http://www.w3.org/2000/svg')
                .attrs('width',  chartWidth, 'height', chartHeight);

  var c = svg.append('circle')
      .attrs('cx', chartWidth/2, 'cy', chartHeight/2)
      .attrs('r',  chartWidth/3, 'fill', 'blue');
}

function drawCircleX2() {
  var svg = d3.select('body')
              .appendx('div.container') //make a container div to ease the saving process
              .append('svg')
                .attrs('xmlns', 'http://www.w3.org/2000/svg')
                .attrs('width',  chartWidth, 'height', chartHeight);

  var c = svg.append('circle')
             .attrs({ cx: chartWidth/2,  cy: chartHeight/2,
                      r:  chartWidth/3,  fill: 'blue' });
}

exports = module.exports = {
  chartWidth,
  chartHeight,
  colours,
  drawCircle,
  drawCircleX, drawCircleX1, drawCircleX2
};

// get this show on the road
if (require.main === module) {
  cl('drawing circle');
  serverd3.drawAndWrite(drawCircle, 'testcirc.svg', '.container');
}
