# matrixcode-svg-evenodd
Generate short SVG for 2D matrix codes using self-intersecting paths and the evenodd fill rule.

![Example QR code](./img/1.svg)

```svg
<svg viewBox="0 0 25 25" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M2 2h7v7H2zm8 0h1v2h-1v1h3V4h-1v5h-1V7h-1V6h3v1h2v5h-1V5h1V2h-1v1h-4zm6 0h7v7h-7zM3 3h5v5H3zm14 0h5v5h-5zM4 4h3v3H4zm14 0h3v3h-3zm-8 4h3v2h-3zm-3 2h2v1H7zm9 0h1v2h-1v1h-2v2h-1v4h1v3h-2v1h-1v-4h1v-5h1v-2h-1v1h-2v-2h6zm2 0h1v1h1v-1h1v2h1v1h-1v1h-3zm4 0h1v1h-1zM2 11h4v1h1v2h2v1H8v-3h1v1H6v1H4v1h1v-2H4v-1H2zm8 3h1v2h-1zm5 0h2v1h1v2h1v-1h2v4h2v1h-2v1h1v1h-2v-2h-2v2h1v-5h-1v1h-2v-4h-1zm7 0h1v1h-3v2h3v1h-3v1h2zM2 16h7v7H2zm1 1h5v5H3zm7 0h7v3h-1v1h1v2h-1v-1h-1v1h-2v-2h-1v-1h3v-2h-5zm-6 1h3v3H4z"></path>
</svg>
```

## Live demo

* [QR code](https://13thirteen.github.io/matrixcode-svg-evenodd/demo/demo_qrcode.html)
* [Aztec code](https://13thirteen.github.io/matrixcode-svg-evenodd/demo/demo_aztec.html)
* [DataMatrix](https://13thirteen.github.io/matrixcode-svg-evenodd/demo/demo_datamatrix.html)

## Installation
```sh
yarn add git://github.com/13thirteen/matrixcode-svg-evenodd.git
```

## Usage
```javascript
import eo from "matrixcode-svg-evenodd";

const width = 16;
const height = 12;
const isFilled = (x, y) => ((x + y) % 2 + x * y % 3) % 2 == 0;  // some pattern

// generate entire SVG file
const svg = eo.getSvg(width, height, isFilled);
// <svg viewBox="0 0 16 12" xmlns="http://www.w3.org/2000/svg">"<path fill-rule="evenodd" d="M0 0h1v1H0zm2 ... 6h2v1h2V9h-1v2h1v1h-3v-1h-1z"></path>"></svg>

// generate path element
const path = eo.getSvgPath(width, height, isFilled);
// <path fill-rule="evenodd" d="M0 0h1v1H0zm2 ... 6h2v1h2V9h-1v2h1v1h-3v-1h-1z"></path> 

// generate path string only
const d = eo.getSvgPathString(width, height, isFilled);
// M0 0h1v1H0zm2 ... 6h2v1h2V9h-1v2h1v1h-3v-1h-1z
```

## Examples

Generating a QR code:
```javascript
import eo from "matrixcode-svg-evenodd";
import qrcodejs from 'qrcode';

const qrcode = qrcodejs.create('Test123');
const width = qrcode.modules.size;
const height = qrcode.modules.size;
const isFilled = (x, y) => qrcode.modules.get(x, y) == 1;
const svg = eo.getSvg(width, height, isFilled);
```

Generating a DataMatrix code:
```javascript
import eo from "matrixcode-svg-evenodd";
import bwipjs from 'bwip-js';

const datamatrix = bwipjs.raw('datamatrix', 'Test123', {});
const width = datamatrix[0].pixx;
const height = datamatrix[0].pixy;
const isFilled = (x, y) => datamatrix[0].pixs[y * datamatrixWidth + x] == 1;
const svg = eo.getSvg(width, height, isFilled);
```

## Motivation
Matrix codes such as [QR codes](https://en.wikipedia.org/wiki/QR_code), [Aztec codes](https://en.wikipedia.org/wiki/Aztec_Code) or [Data Matrix codes](https://en.wikipedia.org/wiki/Data_Matrix) consist of a grid (matrix) of square blocks that are black or white.

In SVG such codes can be represented in different ways. One way is to generate a filled `<path>` for the outline of all black blocks.

Inspired by tools like [SVGO](https://github.com/svg/svgo) and [SVGOMG](https://github.com/jakearchibald/svgomg), this module aims to generate optimized SVG paths for matrix codes.

## Approaches
There are different approaches to generate such a path:

### Trivial: Individual blocks
The trivial approach is to add a closed path around each individual block: Move to the upper left corner of the block, e.g. `M2 2`, then add the block outline `h1v1h-1z`.

![QR code path consisting of individual blocks](./img/2.svg)
```svg
<svg viewBox="0 0 25 25" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
<path d="M2 2h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM10 2h1v1h-1zM14 2h1v1h-1zM16 2h1v1h-1zM17 2h1v1h-1zM18 2h1v1h-1zM19 2h1v1h-1zM20 2h1v1h-1zM21 2h1v1h-1zM22 2h1v1h-1zM2 3h1v1h-1zM8 3h1v1h-1zM11 3h1v1h-1zM12 3h1v1h-1zM13 3h1v1h-1zM14 3h1v1h-1zM16 3h1v1h-1zM22 3h1v1h-1zM2 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM8 4h1v1h-1zM10 4h1v1h-1zM11 4h1v1h-1zM13 4h1v1h-1zM14 4h1v1h-1zM16 4h1v1h-1zM18 4h1v1h-1zM19 4h1v1h-1zM20 4h1v1h-1zM22 4h1v1h-1zM2 5h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM12 5h1v1h-1zM13 5h1v1h-1zM16 5h1v1h-1zM18 5h1v1h-1zM19 5h1v1h-1zM20 5h1v1h-1zM22 5h1v1h-1zM2 6h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM8 6h1v1h-1zM10 6h1v1h-1zM11 6h1v1h-1zM13 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM19 6h1v1h-1zM20 6h1v1h-1zM22 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1zM14 7h1v1h-1zM16 7h1v1h-1zM22 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM17 8h1v1h-1zM18 8h1v1h-1zM19 8h1v1h-1zM20 8h1v1h-1zM21 8h1v1h-1zM22 8h1v1h-1zM10 9h1v1h-1zM11 9h1v1h-1zM12 9h1v1h-1zM14 9h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM14 10h1v1h-1zM16 10h1v1h-1zM18 10h1v1h-1zM20 10h1v1h-1zM22 10h1v1h-1zM2 11h1v1h-1zM3 11h1v1h-1zM4 11h1v1h-1zM5 11h1v1h-1zM10 11h1v1h-1zM11 11h1v1h-1zM12 11h1v1h-1zM13 11h1v1h-1zM15 11h1v1h-1zM16 11h1v1h-1zM18 11h1v1h-1zM19 11h1v1h-1zM20 11h1v1h-1zM4 12h1v1h-1zM5 12h1v1h-1zM6 12h1v1h-1zM8 12h1v1h-1zM10 12h1v1h-1zM11 12h1v1h-1zM13 12h1v1h-1zM14 12h1v1h-1zM15 12h1v1h-1zM18 12h1v1h-1zM19 12h1v1h-1zM20 12h1v1h-1zM21 12h1v1h-1zM5 13h1v1h-1zM7 13h1v1h-1zM13 13h1v1h-1zM18 13h1v1h-1zM19 13h1v1h-1zM20 13h1v1h-1zM4 14h1v1h-1zM8 14h1v1h-1zM10 14h1v1h-1zM12 14h1v1h-1zM13 14h1v1h-1zM15 14h1v1h-1zM16 14h1v1h-1zM22 14h1v1h-1zM10 15h1v1h-1zM12 15h1v1h-1zM16 15h1v1h-1zM17 15h1v1h-1zM20 15h1v1h-1zM21 15h1v1h-1zM2 16h1v1h-1zM3 16h1v1h-1zM4 16h1v1h-1zM5 16h1v1h-1zM6 16h1v1h-1zM7 16h1v1h-1zM8 16h1v1h-1zM12 16h1v1h-1zM16 16h1v1h-1zM17 16h1v1h-1zM19 16h1v1h-1zM21 16h1v1h-1zM2 17h1v1h-1zM8 17h1v1h-1zM10 17h1v1h-1zM11 17h1v1h-1zM13 17h1v1h-1zM14 17h1v1h-1zM15 17h1v1h-1zM17 17h1v1h-1zM18 17h1v1h-1zM19 17h1v1h-1zM20 17h1v1h-1zM22 17h1v1h-1zM2 18h1v1h-1zM4 18h1v1h-1zM5 18h1v1h-1zM6 18h1v1h-1zM8 18h1v1h-1zM12 18h1v1h-1zM15 18h1v1h-1zM17 18h1v1h-1zM19 18h1v1h-1zM21 18h1v1h-1zM2 19h1v1h-1zM4 19h1v1h-1zM5 19h1v1h-1zM6 19h1v1h-1zM8 19h1v1h-1zM11 19h1v1h-1zM12 19h1v1h-1zM13 19h1v1h-1zM15 19h1v1h-1zM16 19h1v1h-1zM19 19h1v1h-1zM20 19h1v1h-1zM2 20h1v1h-1zM4 20h1v1h-1zM5 20h1v1h-1zM6 20h1v1h-1zM8 20h1v1h-1zM11 20h1v1h-1zM14 20h1v1h-1zM15 20h1v1h-1zM19 20h1v1h-1zM20 20h1v1h-1zM21 20h1v1h-1zM22 20h1v1h-1zM2 21h1v1h-1zM8 21h1v1h-1zM11 21h1v1h-1zM12 21h1v1h-1zM14 21h1v1h-1zM15 21h1v1h-1zM16 21h1v1h-1zM18 21h1v1h-1zM20 21h1v1h-1zM2 22h1v1h-1zM3 22h1v1h-1zM4 22h1v1h-1zM5 22h1v1h-1zM6 22h1v1h-1zM7 22h1v1h-1zM8 22h1v1h-1zM11 22h1v1h-1zM13 22h1v1h-1zM14 22h1v1h-1zM16 22h1v1h-1zM18 22h1v1h-1zM20 22h1v1h-1zM21 22h1v1h-1z"></path>
</svg>
```
Length of attribute `d`: 2966 characters

### Better: Run-length encoding
By combining each horizontal sequence of consecutive black blocks into one closed path, we can save some space.
Move to the upper left corner of the block (e.g. `M2 2`), then add the combined block outline e.g. `h7v1h-7z`.

![QR code path with consecutive black blocks combined](./img/3.svg)

```svg

<svg viewBox="0 0 25 25" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
<path d="M2 2h7v1h-7zM10 2h1v1h-1zM14 2h1v1h-1zM16 2h7v1h-7zM2 3h1v1h-1zM8 3h1v1h-1zM11 3h4v1h-4zM16 3h1v1h-1zM22 3h1v1h-1zM2 4h1v1h-1zM4 4h3v1h-3zM8 4h1v1h-1zM10 4h2v1h-2zM13 4h2v1h-2zM16 4h1v1h-1zM18 4h3v1h-3zM22 4h1v1h-1zM2 5h1v1h-1zM4 5h3v1h-3zM8 5h1v1h-1zM12 5h2v1h-2zM16 5h1v1h-1zM18 5h3v1h-3zM22 5h1v1h-1zM2 6h1v1h-1zM4 6h3v1h-3zM8 6h1v1h-1zM10 6h2v1h-2zM13 6h1v1h-1zM16 6h1v1h-1zM18 6h3v1h-3zM22 6h1v1h-1zM2 7h1v1h-1zM8 7h1v1h-1zM11 7h1v1h-1zM14 7h1v1h-1zM16 7h1v1h-1zM22 7h1v1h-1zM2 8h7v1h-7zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h7v1h-7zM10 9h3v1h-3zM14 9h1v1h-1zM7 10h2v1h-2zM14 10h1v1h-1zM16 10h1v1h-1zM18 10h1v1h-1zM20 10h1v1h-1zM22 10h1v1h-1zM2 11h4v1h-4zM10 11h4v1h-4zM15 11h2v1h-2zM18 11h3v1h-3zM4 12h3v1h-3zM8 12h1v1h-1zM10 12h2v1h-2zM13 12h3v1h-3zM18 12h4v1h-4zM5 13h1v1h-1zM7 13h1v1h-1zM13 13h1v1h-1zM18 13h3v1h-3zM4 14h1v1h-1zM8 14h1v1h-1zM10 14h1v1h-1zM12 14h2v1h-2zM15 14h2v1h-2zM22 14h1v1h-1zM10 15h1v1h-1zM12 15h1v1h-1zM16 15h2v1h-2zM20 15h2v1h-2zM2 16h7v1h-7zM12 16h1v1h-1zM16 16h2v1h-2zM19 16h1v1h-1zM21 16h1v1h-1zM2 17h1v1h-1zM8 17h1v1h-1zM10 17h2v1h-2zM13 17h3v1h-3zM17 17h4v1h-4zM22 17h1v1h-1zM2 18h1v1h-1zM4 18h3v1h-3zM8 18h1v1h-1zM12 18h1v1h-1zM15 18h1v1h-1zM17 18h1v1h-1zM19 18h1v1h-1zM21 18h1v1h-1zM2 19h1v1h-1zM4 19h3v1h-3zM8 19h1v1h-1zM11 19h3v1h-3zM15 19h2v1h-2zM19 19h2v1h-2zM2 20h1v1h-1zM4 20h3v1h-3zM8 20h1v1h-1zM11 20h1v1h-1zM14 20h2v1h-2zM19 20h4v1h-4zM2 21h1v1h-1zM8 21h1v1h-1zM11 21h2v1h-2zM14 21h3v1h-3zM18 21h1v1h-1zM20 21h1v1h-1zM2 22h7v1h-7zM11 22h1v1h-1zM13 22h2v1h-2zM16 22h1v1h-1zM18 22h1v1h-1zM20 22h2v1h-2z"></path>
</svg>
```
Length of attribute `d`: 1555 characters

### Best: (Self-) Intersecting paths with long straight edges and the even-odd fill rule
In the optimal case there is exactly one path for each outline edge (between adjacent black and white blocks) and no additional paths inside (between adjacent black blocks) or outside (between adjacent white blocks).

By representing stretches of consecutive horizontal or vertical outline edges with a single path leg, each edge is covered in the shortest possible way.

Alternately following horizontal and vertical edges gives an optimal set of closed outline paths.

And since there is exactly one path for each edge, the [even-odd fill rule](https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule) can be used to automatically determine the correct filling of the shape.

![Optimal QR code path with (self-)intersecting closed sections](./img/4.svg)

```svg
<svg viewBox="0 0 25 25" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M2 2h7v7H2zm8 0h1v2h-1v1h3V4h-1v5h-1V7h-1V6h3v1h2v5h-1V5h1V2h-1v1h-4zm6 0h7v7h-7zM3 3h5v5H3zm14 0h5v5h-5zM4 4h3v3H4zm14 0h3v3h-3zm-8 4h3v2h-3zm-3 2h2v1H7zm9 0h1v2h-1v1h-2v2h-1v4h1v3h-2v1h-1v-4h1v-5h1v-2h-1v1h-2v-2h6zm2 0h1v1h1v-1h1v2h1v1h-1v1h-3zm4 0h1v1h-1zM2 11h4v1h1v2h2v1H8v-3h1v1H6v1H4v1h1v-2H4v-1H2zm8 3h1v2h-1zm5 0h2v1h1v2h1v-1h2v4h2v1h-2v1h1v1h-2v-2h-2v2h1v-5h-1v1h-2v-4h-1zm7 0h1v1h-3v2h3v1h-3v1h2zM2 16h7v7H2zm1 1h5v5H3zm7 0h7v3h-1v1h1v2h-1v-1h-1v1h-2v-2h-1v-1h3v-2h-5zm-6 1h3v3H4z"></path>
</svg>
```
Length of attribute `d`: 491 characters

## Algorithm

1. Generate a graph on the square grid by adding horizontal and vertical edges for each boundary between adjacent black and white blocks
2. Merge consecutive horizontal edges into one long horizontal edge, and merge consecutive vertical edges into one long vertical edge
3. Go to the start (left node) of the next remaining horizontal edge
4. Trace a closed path by alternately following horizontal and vertical edges until you are back at the start
5. Write out these horizontal and vertical movements to the SVG path
6. Remove the edges of that closed path from the graph
7. Repeat steps 3 through 6 until there are no edges left

![Optimal QR code path with animated (self-)intersecting closed sections](./img/5.svg)

## Even-odd fill rule
A fill rule or winding rule determines how a graphical shape with more than one closed outline is filled.

There are two fill rules:
* [Non-zero winding rule](https://en.wikipedia.org/wiki/Nonzero-rule) (default)
* [Even-odd rule](https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule)

In SVG this rule is applied with the [fill-rule attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill-rule) values `nonzero` and `evenodd`.

In PDF, there are different path-painting operators:
| Operation | Non-zero winding rule | Even-odd rule |
| --- | --- | --- |
| Fill | `f` | `f*` |
| Fill and Stroke | `B` | `B*` |
| Close, Fill and Stroke | `b` | `b*` |

In our example:

| Non-zero winding rule | Even-odd rule |
| --- | --- |
| ![Optimal QR code path with (self-)intersecting closed sections](./img/6.svg) | ![Optimal QR code path with (self-)intersecting closed sections](./img/4.svg) |
