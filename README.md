
# d3x - d3.js, extended

### Example

```javascript
var body = d3.select('body');

var svg = body.appendx('svg[width=200 height=200]');

svg.append('circle')
   .attrx('cx=40 cy=40 r=6 fill=blue');

svg.appendx('circle')
   .attrx({cx: 80, cy: 40, r: 6, fill: 'green'});

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
SVG, they are natively often rather low-level beasts.

Partially as a result, d3 programs tend to be rather long, even when creating
fairly simple visual objects. Over time, d3 could "fill in gaps" and increase
the semantic level at which d3 developers work. While d3 is improving, it isn't
always up-leveling. d3 v4, for instance, removes the ability to set multiple
attributes or styles at a time that was present in v3. That ability has been
moved instead to a separate module, making it arguably less readily rather than
more readily available.

d3x's goal is therefore to fill in gaps. When d3 or SVG has a long,
laborious, or low-level approach, d3x aims to provide pithier,
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

d3x shortens this, e.g. to:

```javascript
svg.appendx('circle.focal-point')
   .attrx('cx=40 cy=40 r=20')
   .attrx('fill=blue fill-opacity=0.5')
   .attrx('stroke=gray stroke-width=2');
```

That's 4 lines instead of 9. No excess punctuation or data framing is required,
because it can be reliably inferred. You can quote the attribute values,
however, if you wish. That way, if you see attributes in raw SVG or HTML you
want in your program, you can simpy copy and paste. There's no need to rewrite
XML-style `fill="blue"` or even CSS-style `border: thin solid red` yet you need
it in JavaScript literals for `.attr('fill', 'blue')` or `.style('border', 'thin
solid red')`. That kind of reformatting isn't hard, *per se*, but it takes time
and introduces possible errors and frustrations. Much easier to drop it in as
is, see if it produces the effect you like, and move on.

d3x won't change any existing d3 behavior. For compatibility,
it will only extend and add. If you want `.append` with the
expanded functionality, use `.appendx`. Similarly for `.insertx`,
`.attrx`, and `.stylex`.

### The Rules

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


