

const cl = console.log;
const d3 = require('d3');
const serverd3 = require('./serverd3');
const assert = require('chai').assert;

// exercising code
var c4 = require('./circle4');

var functions = [ c4.drawCircle,
                  c4.drawCircleX,
                  c4.drawCircleX1,
                  c4.drawCircleX2
                ];

functions.forEach(f => {

  describe('testing ' + f.name, function(){

    before(function(done) {
      serverd3.serverSideD3(function() { f(); done(); });
    });

    it('should set basic circle attributes', function(){
      var c = d3.select('circle');
      assert.equal(c.attr('cx'), c4.chartWidth/2);
      assert.equal(c.attr('cy'), c4.chartHeight/2);
      assert.equal(c.attr('fill'), 'blue');
    });

    it('should have just one circle', function(){
      var cs = d3.selectAll('circle');
      assert.equal(cs.size(), 1);
    });

  });

});
