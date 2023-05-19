import { EdgeRunLengthMatrix } from "./EdgeRunLengthMatrix";

export class MatrixCodeSVGEvenOdd {

    public static getSvg(width: number, height: number, isFilled: (x: number, y: number) => boolean): string {
        const path = this.getSvgPath(width, height, isFilled);
        return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">"${path}"></svg>`; // width="300" height="300" 
    }

    public static getSvgPath(width: number, height: number, isFilled: (x: number, y: number) => boolean): string {
        const string = this.getSvgPathString(width, height, isFilled);
        return `<path fill-rule="evenodd" d="${string}"></path>`;
    }

    public static getSvgPathString(width: number, height: number, isFilled: (x: number, y: number) => boolean): string {
        const components = this.getSvgPathStringComponents(width, height, isFilled, true);
        return components.join('');
    }

    public static getSvgPathStringComponents(width: number, height: number, isFilled: (x: number, y: number) => boolean, relative: boolean): string[] {
        const horizontal = EdgeRunLengthMatrix.createFromBitMatrix(width, height, true, isFilled);
        const vertical = EdgeRunLengthMatrix.createFromBitMatrix(width, height, false, isFilled);
        
        const components: string[] = [];
        let path = '';
        let x = 0;
        let y = 0;
        let xo = 0;
        let yo = 0;
        let rel = '';
        let abs = '';
        while (horizontal.getNumberOfEdges() > 0) {
            path = '';
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
            } while (x !== xo || y !== yo) 
            components.push(path);
        }
        return components;
    }
}
