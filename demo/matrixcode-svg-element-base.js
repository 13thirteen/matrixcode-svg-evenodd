import MatrixCodeSVGEvenOdd from "./matrixcode-svg-evenodd.js";

export class MatrixcodeSvgElementBase extends HTMLElement {
  svg;
  d;
  svgSource;

  static get observedAttributes() {
    return [
      "algo",
      "mode",
      "fill", 
      "fill-opacity", 
      "height", 
      "quiet", 
      "stroke", 
      "stroke-linecap", 
      "stroke-linejoin", 
      "stroke-miterlimit", 
      "stroke-opacity", 
      "stroke-width", 
      "value", 
      "width", 
    ];
  }

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.update();
    this.shadowRoot.append(this.svg);
  }

  get d() {
    return this.d;
  }

  get svgSource() {
    return this.svgSource;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.update();
  }

  updateValue(value) {
  }

  getWidth() {
    return 0;
  }

  getHeight() {
    return 0;
  }
  
  isFilled(x, y) {
    return false;
  }

  update() {
    const value = this.hasAttribute("value") ? this.getAttribute("value") : "Test";
    const algo = this.hasAttribute("algo") ? this.getAttribute("algo") : "blocks";
    const mode = this.hasAttribute("mode") ? this.getAttribute("mode") : "fill";
    
    this.updateValue(value);

    const viewBox = this.getViewBox();
    this.svg.setAttribute("viewBox", viewBox);
    this.updateAttribute(this.svg, "width");
    this.updateAttribute(this.svg, "height");

    this.svg.replaceChildren();
    const bg = this.svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
    bg.setAttribute("d", `M0 0h${this.getWidth()}v${this.getHeight()}H0z`);
    bg.setAttribute("fill", "#fff");
    bg.setAttribute("fill-opacity", "40%");

    this.d = this.getPathStrings(algo, false).join("");
    this.svgSource = `<svg viewBox="${viewBox}" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
<path ${algo === "evenodd" ? 'fill-rule="evenodd" ' : ""}d="${this.d}"/>
</svg>`;
    let path = this.svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
    path.setAttribute("d", this.d);
    path.setAttribute("class", "path");
    path.setAttribute("fill-rule", algo === "evenodd" ? "evenodd" : "nonzero");
    // path.setAttribute("shape-rendering", "crispEdges");
    this.updateAttribute(path, "fill");
    if (mode === "fill") {
      this.updateAttribute(path, "fill-opacity");
    } else if (mode === "stroke") {
      path.setAttribute("fill-opacity", "20%");
      this.updateAttribute(path, "stroke");
      this.updateAttribute(path, "stroke-linecap");
      this.updateAttribute(path, "stroke-linejoin");
      this.updateAttribute(path, "stroke-miterlimit");
      this.updateAttribute(path, "stroke-opacity");
      this.updateAttribute(path, "stroke-width");
    } else {
      path.setAttribute("fill-opacity", "20%");
      const invphi = 2 / (1 + Math.sqrt(5));
      this.getPathStrings(algo, true).forEach((pathString, i) => {
        path = this.svg.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "path"));
        path.setAttribute("d", pathString);
        path.setAttribute("class", "path");
        // path.setAttribute("shape-rendering", "crispEdges");
        path.setAttribute("fill", "none");
        this.updateAttributeValue(path, "stroke", `hsl(calc(${i} * ${invphi.toFixed(3)}turn), 100%, 30%)`);
        this.updateAttribute(path, "stroke-linecap");
        this.updateAttribute(path, "stroke-linejoin");
        this.updateAttribute(path, "stroke-miterlimit");
        this.updateAttribute(path, "stroke-opacity");
        this.updateAttribute(path, "stroke-width");
        if (mode === "animate") {
          path.setAttribute("stroke-dasharray", "1.3 1");
          path.setAttribute("stroke-dashoffset", "1.3");
          path.setAttribute("pathLength", "1");
        }
      });
    }

    if (mode === "animate") {
      const style = this.svg.appendChild(document.createElement("style"));
      style.textContent = `
      .path {
        animation: dash 5s linear forwards infinite;
      }
      @keyframes dash {
        to {
          stroke-dashoffset: 0;
        }
      }
      `;
    }

    this.dispatchEvent(new Event("updated"));
  }

  updateAttribute(element, attributeName) {
    if (this.hasAttribute(attributeName) && !element.hasAttribute(attributeName)) {
      element.setAttribute(attributeName, this.getAttribute(attributeName));
    } else if (!this.hasAttribute(attributeName) && element.hasAttribute(attributeName)) {
      element.removeAttribute(attributeName);
    }
  }

  updateAttributeValue(element, attributeName, attributeValue) {
    if (attributeValue !== null && !element.hasAttribute(attributeName)) {
      element.setAttribute(attributeName, attributeValue);
    } else if (attributeValue === null && element.hasAttribute(attributeName)) {
      element.removeAttribute(attributeName);
    }
  }

  getViewBox() {
    return `-1 -1 ${this.getWidth() + 2} ${this.getHeight() + 2}`;
  }

  getPathStrings(algo, separate) {
    if (algo === "blocks") {
      return this.getPathStringsBlocks(separate);
    } else if (algo === "runlength") {
      return this.getPathStringsRunLength(separate);
    } else if (algo === "evenodd") {
      return this.getPathStringsEvenOdd(separate);
    }
  }
  getPathStringsBlocks(separate) {
    let parts = [];
    const w = this.getWidth();
    const h = this.getHeight();
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (this.isFilled(x, y))
          parts.push(`M${x} ${y}h1v1h-1z`);
      }
    }
    return separate ? parts : [parts.join("")];
  }
  getPathStringsRunLength(separate) {
    let parts = [];
    const w = this.getWidth();
    const h = this.getHeight();
    for (let y = 0; y < h; y++) {
      let x = 0;
      while (x < w) {
        while (x < w && !this.isFilled(x, y)) { x++; }
        let n = 0;
        while ((x + n) < w && this.isFilled(x + n, y)) { n++; }
        if (n > 0) {
          parts.push(`M${x} ${y}h${n}v1h${-n}z`);
          x += n;
        }
      }
    }
    return separate ? parts : [parts.join("")];
  }
  getPathStringsEvenOdd(separate) {
    const w = this.getWidth();
    const h = this.getHeight();
    const isFilled = (x, y) => this.isFilled(x, y);
    return separate ? 
      MatrixCodeSVGEvenOdd.getSvgPathStringComponents(w, h, isFilled, false) :
      [MatrixCodeSVGEvenOdd.getSvgPathString(w, h, isFilled)];
  }
}
