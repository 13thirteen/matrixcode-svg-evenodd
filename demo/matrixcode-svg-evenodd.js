// src/EdgeRunLengthMatrix.ts
var EdgeRunLengthMatrix = class {
  static createFromBitMatrix(width, height, horizontal, isFilled) {
    const segments = horizontal ? width : height;
    const rows = horizontal ? height + 1 : width + 1;
    const get = horizontal ? (s, r2) => isFilled(s, r2) : (s, r2) => isFilled(r2, s);
    const data = segments < 128 ? new Int8Array(segments * rows) : segments < 32768 ? new Int16Array(segments * rows) : new Int32Array(segments * rows);
    let edges = 0;
    let r = 0;
    edges += this.runLengthEncodeRow(segments, r, (se, ro) => get(se, ro), data);
    for (r = 1; r < rows - 1; r++) {
      edges += this.runLengthEncodeRow(segments, r, (se, ro) => get(se, ro - 1) !== get(se, ro), data);
    }
    edges += this.runLengthEncodeRow(segments, r, (se, ro) => get(se, ro - 1), data);
    return new EdgeRunLengthMatrix(horizontal, segments, rows, edges, data);
  }
  static runLengthEncodeRow(segments, r, isEdge, data) {
    let edges = 0;
    let s = 0;
    while (s < segments) {
      let n = 0;
      while (!isEdge(s, r) && s < segments) {
        s++;
        n++;
      }
      this.runLengthEncodeRun(segments, s, r, n, data, -n);
      n = 0;
      while (isEdge(s, r) && s < segments) {
        s++;
        n++;
      }
      this.runLengthEncodeRun(segments, s, r, n, data, n);
      edges += n;
    }
    return edges;
  }
  static runLengthEncodeRun(segments, s, r, n, data, value) {
    for (let i = 0; i < n; i++) {
      data[r * segments + s - n + i] = value;
    }
  }
  constructor(horizontal, segments, rows, edges, data) {
    this.horizontal = horizontal;
    this.segments = segments;
    this.rows = rows;
    this.edges = edges;
    this.data = data;
  }
  toLocal(x, y) {
    return this.horizontal ? [x, y] : [y, x];
  }
  fromLocal(s, r) {
    return this.horizontal ? [s, r] : [r, s];
  }
  getNumberOfEdges() {
    return this.edges;
  }
  getNextNode() {
    if (this.edges === 0) {
      throw new Error("No edges left");
    }
    let s = 0;
    let r = 0;
    while (this.data[r * this.segments + s] === -this.segments) {
      r++;
    }
    if (this.data[r * this.segments + s] < 0) {
      s = -this.data[r * this.segments + s];
    }
    return this.fromLocal(s, r);
  }
  popRunAt(x, y) {
    const [s, r] = this.toLocal(x, y);
    if (s < 0 || s > this.segments || r < 0 || r >= this.rows) {
      throw new Error(`Index out of bounds: s: ${s}, r: ${r}, segments: ${this.segments}, rows: ${this.rows}`);
    }
    if (s > 0 && this.data[r * this.segments + s - 1] > 0) {
      const n = this.data[r * this.segments + s - 1];
      const before = s < this.segments ? -this.data[r * this.segments + s] : 0;
      const after = s - n > 0 ? -this.data[r * this.segments + s - n - 1] : 0;
      for (let i = -before; i < n + after; i++) {
        this.data[r * this.segments + s - 1 - i] = -(before + n + after);
      }
      this.edges -= n;
      return -n;
    } else {
      const n = this.data[r * this.segments + s];
      const before = s > 0 ? -this.data[r * this.segments + s - 1] : 0;
      const after = s + n < this.segments ? -this.data[r * this.segments + s + n] : 0;
      for (let i = -before; i < n + after; i++) {
        this.data[r * this.segments + s + i] = -(before + n + after);
      }
      this.edges -= n;
      return n;
    }
  }
};

// src/MatrixCodeSVGEvenOdd.ts
var MatrixCodeSVGEvenOdd = class {
  static getSvg(width, height, isFilled) {
    const path = this.getSvgPath(width, height, isFilled);
    return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">"${path}"></svg>`;
  }
  static getSvgPath(width, height, isFilled) {
    const string = this.getSvgPathString(width, height, isFilled);
    return `<path fill-rule="evenodd" d="${string}"></path>`;
  }
  static getSvgPathString(width, height, isFilled) {
    const components = this.getSvgPathStringComponents(width, height, isFilled, true);
    return components.join("");
  }
  static getSvgPathStringComponents(width, height, isFilled, relative) {
    const horizontal = EdgeRunLengthMatrix.createFromBitMatrix(width, height, true, isFilled);
    const vertical = EdgeRunLengthMatrix.createFromBitMatrix(width, height, false, isFilled);
    const components = [];
    let path = "";
    let x = 0;
    let y = 0;
    let xo = 0;
    let yo = 0;
    let rel = "";
    let abs = "";
    while (horizontal.getNumberOfEdges() > 0) {
      path = "";
      [x, y] = horizontal.getNextNode();
      rel = `m${x - xo} ${y - yo}`;
      abs = `M${x} ${y}`;
      if (!relative || components.length == 0) {
        path += abs;
      } else {
        path += abs.length < rel.length ? abs : rel;
      }
      xo = x;
      yo = y;
      do {
        const h = horizontal.popRunAt(x, y);
        x += h;
        rel = `h${h}`;
        abs = `H${x}`;
        path += abs.length < rel.length ? abs : rel;
        const v = vertical.popRunAt(x, y);
        y += v;
        if (x === xo && y === yo) {
          path += `z`;
        } else {
          rel = `v${v}`;
          abs = `V${y}`;
          path += abs.length < rel.length ? abs : rel;
        }
      } while (x !== xo || y !== yo);
      components.push(path);
    }
    return components;
  }
};
export {
  EdgeRunLengthMatrix,
  MatrixCodeSVGEvenOdd as default
};
