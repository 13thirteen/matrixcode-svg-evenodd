type TypedArray = Int8Array | Int16Array | Int32Array;

export class EdgeRunLengthMatrix {

    public static createFromBitMatrix(width: number, height: number, horizontal: boolean, isFilled: (x: number, y: number) => boolean) {
        const segments = horizontal ? width : height;
        const rows = horizontal ? height + 1 : width + 1;
        const get = horizontal ? (s: number, r: number) => isFilled(s, r) : (s: number, r: number) => isFilled(r, s);
        const data = segments < 128 ? new Int8Array(segments * rows) :
                     segments < 32768 ? new Int16Array(segments * rows) :
                     new Int32Array(segments * rows);
        let edges = 0;
        let r = 0;

        edges += this.runLengthEncodeRow(segments, r, (se, ro) => get(se, ro), data);
        for (r = 1; r < rows - 1; r++) {
            edges += this.runLengthEncodeRow(segments, r, (se, ro) => get(se, ro - 1) !== get(se, ro), data);
        }
        // r = rows - 1;
        edges += this.runLengthEncodeRow(segments, r, (se, ro) => get(se, ro - 1), data);
        return new EdgeRunLengthMatrix(horizontal, segments, rows, edges, data);
    }
  
    private static runLengthEncodeRow(segments: number, r: number, isEdge: (s: number, r: number) => boolean, data: TypedArray): number {
        let edges = 0;
        let s = 0;
        while (s < segments) {
            let n = 0;
            while(!isEdge(s, r) && s < segments) { s++; n++; }
            this.runLengthEncodeRun(segments, s, r, n, data, -n);

            n = 0;
            while(isEdge(s, r) && s < segments) { s++; n++; }
            this.runLengthEncodeRun(segments, s, r, n, data, n);
            edges += n;
        }
        return edges;
    }

    private static runLengthEncodeRun(segments: number, s: number, r: number, n: number, data: TypedArray, value: number) {
        for (let i = 0; i < n; i++) {
            data[r * segments + s - n + i] = value;
        }
    }
    
    private horizontal: boolean;
    private segments: number;
    private rows: number;
    private edges: number;
    private data: TypedArray;
  
    constructor(horizontal: boolean, segments: number, rows: number, edges: number, data: TypedArray) {
        this.horizontal = horizontal;
        this.segments = segments;
        this.rows = rows;
        this.edges = edges;
        this.data = data;
    }

    private toLocal(x: number, y: number): [number, number] {
        return this.horizontal ? [x, y] : [y, x];
    }
  
    private fromLocal(s: number, r: number): [number, number] {
        return this.horizontal ? [s, r] : [r, s];
    }
  
    public getNumberOfEdges(): number {
        return this.edges;
    }

    public getNextNode(): [number, number] {
        if (this.edges === 0) { 
            throw new Error('No edges left');
        }
        let s = 0;
        let r = 0;
        while (this.data[r * this.segments + s] === -this.segments) { r++; }
        if (this.data[r * this.segments + s] < 0) { s = -this.data[r * this.segments + s]}
        return this.fromLocal(s, r);
    }

    public popRunAt(x: number, y: number): number {
        const [s, r] = this.toLocal(x, y);
        if (s < 0 || s > this.segments || r < 0 || r >= this.rows) {
            throw new Error(`Index out of bounds: s: ${s}, r: ${r}, segments: ${this.segments}, rows: ${this.rows}`);
        }

        // Remove edge run by merging it with background runs before and after.
        // Store (negative) length of new background run to each segment.
        // Return direction (sign) and length of removed edge run.

        if (s > 0 && this.data[r * this.segments + s - 1] > 0) {
            // edge in negative direction
            const n = this.data[r * this.segments + s - 1];
            const before = s < this.segments ? -this.data[r * this.segments + s] : 0;
            const after = s - n > 0 ? -this.data[r * this.segments + s - n - 1] : 0;
            for (let i = -before; i < n + after; i++) {
                this.data[r * this.segments + s - 1 - i] = -(before + n + after);
            }
            this.edges -= n;
            return -n;
        } else {
            // edge in positive direction
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
}
