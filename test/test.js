var assert = require('chai').assert;

var Enum;

// Test both ES2015 base code and ES5 generated code
['d3x' // , 'd3x.es5'
 ].forEach(ver => {
  describe(ver + '.js', function() {
    Enum = require('../' + ver);
    test_d3x();
  });
});

function test_d3x() {


describe('isQuote', function() {

  it('should accept single quotes', function(){
    assert.isOk(isQuote(`'`));
  });

  it('should accept double quotes', function(){
    assert.isOk(isQuote(`"`));
  });

  it('should not recognize other characters', function(){
    const nonQuotes = `!@#$$%^&*()abcdeABCDE_`.split('');
    nonQuotes.forEach(c => assert.isNotOk(isQuote(c)));
  });

});

describe('isWhitespace', function() {

  it('should accept spaces', function(){
    assert.isOk(isWhitespace(` `));
  });

  it('should accept tabs', function(){
    assert.isOk(isWhitespace(`\t`));
  });

  it('should accept newlines', function(){
    assert.isOk(isWhitespace(`\n`));
  });

  it('should not recognize other characters', function(){
    const nonWS = `!@#$$%^&*()abcdeABCDE_`.split('');
    nonWS.forEach(c => assert.isNotOk(isWhitespace(c)));
  });

});


describe('indexOfAny', function() {

  it('should find appropriate sub-strings', function(){
    assert.equal(indexOfAny('this=that', ['=', ':']), 4);
    assert.equal(indexOfAny('this:that', ['*', ':']), 4);
  });

  it('should return -1 if not found', function(){
    assert.equal(indexOfAny('this-that', ['=', ':']), -1);
    assert.equal(indexOfAny('this/that', ['*', ':']), -1);
  });
});


describe('eltParse', function() {

  it('should rneder elements, classes, ids', function(){

    assert.deepEqual(eltParse('div#one.a.b'),
                              { element: 'div',
                                id: 'one',
                                'class': 'a b' });
  });

  it('should identify elements', function(){
    assert.deepEqual(eltParse('div'),
                     {element: 'div'});
  });
  it('should identify ids', function(){
    assert.deepEqual(eltParse('#graph'),
                     {id: 'graph'});
  });
  it('should identify classes', function(){
    assert.deepEqual(eltParse('.one.two'),
                     {'class': 'one two'});
  });
  it('should mix and match', function(){
    assert.deepEqual(eltParse('div.one.two'),
                     {element: 'div', 'class': 'one two'});
    assert.deepEqual(eltParse('div#thing'),
                     {element: 'div', id: 'thing'});
  });
  it('should handle attribute assignments', function(){
    assert.deepEqual(eltParse('[name=bill]'),
                     {'name': 'bill'});
    assert.deepEqual(eltParse('[id=bill]'),
                     {'id': 'bill'});
  });
  it('should handle extended attribute assignments', function(){
    assert.deepEqual(eltParse('[name=bill; color=green; type="css"]'),
                     {'name': 'bill', color: 'green', type: 'css'});
  });
  it('should mix and match attributes with the others', function(){
    assert.deepEqual(eltParse('span.roger[name=bill]'),
                     {element: 'span', 'class': 'roger', name: 'bill'});
    assert.deepEqual(eltParse('text.label[fill=green]'),
                     {element: 'text', 'class': 'label', fill: 'green'});
  });
  it('should handle extended attributes with colons not equals', function(){
    assert.deepEqual(eltParse('[name:bill; color:green; type="css"]'),
                     {'name': 'bill', color: 'green', type: 'css'});
  });
  it('should handle extended attributes with spaces in quotes', function(){
    assert.deepEqual(eltParse('[type="css rocks" name="bill"]'),
                     {'name': 'bill', type: 'css rocks'});
  });
});


describe('attrParse', function() {

  it('should render attrs', function(){

    assert.deepEqual(attrParse('a=12 b=23'),
                              { a: '12',
                                b: '23' });

   });

   it('should render attrs with quotes', function(){

    assert.deepEqual(attrParse(`a="12" b='23'`),
                              { a: '12', b: '23' });

  });

  it('should render attrs with spaces in quotes', function(){

    assert.deepEqual(attrParse(`a="12 to 13" b='23 or more'`),
                              { a: '12 to 13',
                                b: '23 or more' });
  });


  it('should render css attrs with quotes', function(){

    assert.deepEqual(attrParse(`a: "12" b: '23'`),
                              { a: '12', b: '23' });

  });

  it('should render css attrs with spaces in quotes', function(){

    assert.deepEqual(attrParse(`a: "12 to 13" b:'23 or more'`),
                              { a: '12 to 13',
                                b: '23 or more' });

  });


  it('should render attrs with : format', function(){

    assert.deepEqual(attrParse('a:12 b:23'),
                              { a: '12',
                                b: '23' });
  });

  it('should render attrs with : format separated with ;', function(){

    assert.deepEqual(attrParse('a:12; b:23'),
                              { a: '12',
                                b: '23' });
  });

  it('should render partial attrs', function(){

    assert.deepEqual(attrParse(`a="12" b=`),
                              { a: '12',
                                b: undefined });
    assert.deepEqual(attrParse(`a`), { a: undefined });
    assert.deepEqual(attrParse(`a:`), { a: undefined });
  });

});

}
