
# d3x - d3.js, extended

d3x is an experimental extension package to make d3
programming quicker and more straightforward.

It is very early days. The module, tests, design, and
docs are just coming together. Buyer beware!

### Example

```javascript
var body = d3.select('body');

var svg = body.appendx('svg[width=200 height=200]');

svg.append('circle')
   .attrx('cx=40 cy=40 r=6 fill=blue');

svg.appendx('circle')
   .attrs({cx: 80, cy: 40, r: 6, fill: 'green'});

svg.appendx('line')
   .attrx('x1: 40 y1:40 x2:80 y2:40 stroke: purple')
   .lower();
```

Combined with ES2015 [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals),
specifying d3 objects just got a whole lot easier.

### Background and Motivation

[d3.js](https://d3js.org) is an awesome content creation pipeline for HTML and
SVG, but its semantic level is uneven. One minute it provides amazing high-level
constructs that make manipulating data then drawing and animating content *so*
much easier. Then the next moment, it requires you laboriously specify content
attributes one by single one. And while you can do great things with HTML and
SVG, they are themselves natively rather low-level beasts.

Partially as a result, d3 programs tend to be rather long, even when creating
fairly simple visual objects. Over time, d3 could "fill in gaps" and increase
the semantic level at which developers work. But that doesn't always seem to be
the case. D3 is improving, but it isn't always up-leveling. The most recent
version 4, for instance, removes the ability to conveniently set multiple
attributes or styles at a time that was present in v3. That ability isn't
strictly gone, but it's been moved instead to a separate module, making it less
readily available.

d3x's goal is therefore to fill in gaps, both in d3 and the underlying HTML
and SVG facilitates. When d3 or SVG has a long,
laborious, or low-level approach, d3x hopes to provide pithier,
higher-level mechanisms as extensions.

d3x's first target is
attribute setting. E.g. instead of:

```javascript
svg.append('circle')
   .attr('class', 'focal-point')
   .attr('cx', 40)
   .attr('cy'. 40)
   .attr('r', 20)
   .attr('fill', 'blue')
   .attr('fill-opacity', 0.5)
   .attr('stroke', 'gray')
   .attr('stroke-width', 2);
```

d3x enables this to be shortened, e.g. to:

```javascript
svg.appendx('circle.focal-point')
   .attrx('cx=40 cy=40 r=20')
   .attrx('fill=blue fill-opacity=0.5')
   .attrx('stroke=gray stroke-width=2');
```

That's 4 lines instead of 9. No excess punctuation or data framing is required,
because it can be reliably inferred. You can quote the attribute values,
however, if you wish. That way, if you see attributes in raw SVG or HTML you
want in your program, you can simply copy and paste. There's no need to rewrite
XML-style `fill="blue"` or even CSS-style `border: thin solid red` yet you need
it in JavaScript literals for `.attr('fill', 'blue')` or `.style('border', 'thin
solid red')`. That kind of reformatting isn't hard, *per se*, but it takes time
and introduces possible errors and frustrations. Much easier to drop it in as
is, see if it produces the effect you like, and move on.

d3x won't change any existing d3 behavior. For compatibility,
it will only extend and add. If you want `.append` with the
expanded functionality, use `.appendx`. Similarly for `.insertx`,
`.attrx`, and `.stylex`. It does use the same `.attrs` and `.styles`
method names used by [d3-selection-multi](https://github.com/d3/d3-selection-multi),
for which it provides a superset of the native functions.

### Multiple Setting

There are several routes to setting multiple attribute values
at a time. The string representations modeled above are very
convenient for copying and pasting content directly from existing
SVG or CSS right into your program. But, they come with some (modest)
parsing overhead. They also require the use of newfangled ES2015
template strings if you need to introduce live values into the parsed
content. So there is another route: `.attrs` and `.styles` methods.
These accept either JavaScript objects or series of key-value pairs.
They do no parsing of the keys or values. The above value setting could
be alternately accomplished with:

```javascript
svg.appendx('circle.focal-point')
   .attrs({ cx: 40, cy: 40, r: 20 })
   .attrs({ fill: 'blue', 'fill-opacity': 0.5 })
   .attrs({ stroke: 'gray', 'stroke-width': 2 });
```

This has the benefit of piggybacking JS object literals.
There is a little bit more quoting and syntax required, but
at runtime is very efficient.

Or there is the mutli-setter format:

```javascript
svg.appendx('circle.focal-point')
   .attrs('cx', 40, 'cy', 40, 'r', 20)
   .attrs('fill', 'blue', 'fill-opacity', 0.5)
   .attrs('stroke', 'gray', 'stroke-width', 2);
```

This has the virtue of being closest to the original `.attr`
format, and the easiest to quickly adapt code to if what you
want to do is to use vertical program space more effectively.

### Parsing Rules

There are two overlapping but distinct
sets of parsing rules: One for adding elements (e.g. with
`.appendx` and `.insertx`) and one for updating attributes
and styles (`.attrx` and `.stylex`).

For `.appendx` and `.insertx`, the primary form is;

    element#idname.class1.class2

An element tag, followed by an optional id, and optional
multiple class names. The element created would be

    <element id='idname' class='class1 class2'>

This is inspired by and conforms with the CSS selector
syntax widely used in JavaScript.

It is additionally possible to set other attribute values by enclosing a
`[name=value]` assignment in brackets. The value can be quoted (either singly or
doubly), but need not be unless you wish to include space characters. To specify
multiple attributes, this form can be repeated e.g.
`[name=value][other=another]` just as in CSS selectors.

However the multiple bracketing is unnecessary, as either spaces or semicolons
can separate items (as in HTML and XML, or as in CSS definitions, respectively).
So `[name=value other=another]` works. While we provide this form for
completeness, it is recommended that element creation calls define only element,
id, and class values, leaving other attributes for subsequent attribute-setting
calls.

### Why So Many Ways?

d3x provides a large number of different approaches. Why so many?

1. Because configuration data may already be in a variety of formats, from
   existing HTML/SVG or CSS definitions, or JavaScript objects, or JS method
   calls. The variety and diversity of inputs is a huge driver.

2. To accommodate a range of data liveness, from static, to dynamic, to dynamic per
   item. Different forms suit the different levels of dynamisms better or worse.

3. Different use cases.

4. Experimentation. It's not entirely clear what the "best" approach(es) will be,
   so we provide multiple avenues. It's likely that the `.attrs` and `.styles`
   approaches will be recommended for many uses, with `.attrx` and `.stylex`
   recommended largely for static programs and bringing data in from other sources.

### Testing and Reliability

The interpretation rules here are very inclusive: A superset of CSS selector and
HTML/XML style attribute setting, plus an extension of d3 function calls,
including multi-attribute-at-a-time calls that d3 v4 moves to `.attrs` and
`.styles`. (There are some down-steps currently, specially regarding the methods
taking functions.) This kind of fluidity can make reliable parsing tricky. In
order to ensure that parsing is done well and reliably, parsing functions are
fairly heavily tested, including with adversarial examples, and the number of
tests will grow over time.

### Performance

d3x extended attribute setting undoubtedly does more parsing and interpretation
work than d3's native methods. They will take at least slightly longer to run.
Is that extra overhead important? In many cases, no. Not at all.

Extended parsing may take longer, but the times will be measured in microseconds
either way. Attribute parsing will often not be on any performance critical
path. In odd cases where it is, feel free to start with extended d3x style
definitions, then replace those with the native setting methods over time as
your program moves through the optimization phase. While we believe extended
parsing suitably performant for most visualization apps, we're perfectly happy
if you only use the extended forms as an accelerator for initial development and
prototyping.

### Other Functions

Shortening attribute setting neatens a program, but
will generally shave only 5-10% off the source code length. Other
simplifications are needed to markedly improve a d3 program's
operation. Over time d3x
features for managing geometry, text, and other aspects will be added.
