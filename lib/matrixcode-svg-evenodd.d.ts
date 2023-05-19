declare module "EdgeRunLengthMatrix" {
    type TypedArray = Int8Array | Int16Array | Int32Array;
    export class EdgeRunLengthMatrix {
        static createFromBitMatrix(width: number, height: number, horizontal: boolean, isFilled: (x: number, y: number) => boolean): EdgeRunLengthMatrix;
        private static runLengthEncodeRow;
        private static runLengthEncodeRun;
        private horizontal;
        private segments;
        private rows;
        private edges;
        private data;
        constructor(horizontal: boolean, segments: number, rows: number, edges: number, data: TypedArray);
        private toLocal;
        private fromLocal;
        getNumberOfEdges(): number;
        getNextNode(): [number, number];
        popRunAt(x: number, y: number): number;
    }
}
declare module "MatrixCodeSVGEvenOdd" {
    export class MatrixCodeSVGEvenOdd {
        static getSvg(width: number, height: number, isFilled: (x: number, y: number) => boolean): string;
        static getSvgPath(width: number, height: number, isFilled: (x: number, y: number) => boolean): string;
        static getSvgPathString(width: number, height: number, isFilled: (x: number, y: number) => boolean): string;
        static getSvgPathStringComponents(width: number, height: number, isFilled: (x: number, y: number) => boolean, relative: boolean): string[];
    }
}
declare module "index" {
    export { EdgeRunLengthMatrix } from "EdgeRunLengthMatrix";
    export { MatrixCodeSVGEvenOdd as default } from "MatrixCodeSVGEvenOdd";
}
