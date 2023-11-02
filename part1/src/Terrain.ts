// a class to generate a terrain mesh
// based on a heightmap image

import PPM from './PPM';

class Terrain {
    // the heightmap image
    private _heightmap?: PPM = undefined;

    // the width of the terrain
    private _width: number = 0;
    // the depth of the terrain
    private _depth: number = 0;

    // the number of triangles in the width direction
    private _widthSegments: number = 0;
    // the number of triangles in the depth direction
    private _depthSegments: number = 0;

    private _maxHeight: number = 0;
    private _textureOffset: number = 0;
    private _stride: number = 0;


    setParameters(heightmap: PPM, width: number, depth: number, widthSegments: number, depthSegments: number, maxHeight: number): void {
        this._heightmap = heightmap;
        this._width = width;
        this._depth = depth;
        this._widthSegments = widthSegments;
        this._depthSegments = depthSegments;
        this._maxHeight = maxHeight;
    }

    // create the vertex data for the terrain assuming that we are going to use
    // triangle strip for rendering

    // the vertex data will be stored in the following order:
    // positionX, positionY, positionZ, normalX, normalY, normalZ, texCoordS, texCoordT
    // where the texture coordinates range from 0 to 1 in both directions

    // the vertex data will be stored in a Float32Array

    getHeight(u: number, v: number): number {

        if (this._heightmap === undefined) {
            return Math.sin(u * 2 * Math.PI) * Math.sin(v * 2 * Math.PI);
        }

        const ppmWidth = this._heightmap.width;
        const ppmHeight = this._heightmap.height;

        let x = Math.floor(u * ppmWidth);
        if (x === ppmWidth) {
            x = ppmWidth - 1;
        }
        let y = Math.floor(v * ppmHeight);
        if (y === ppmHeight) {
            y = ppmHeight - 1;
        }

        let pixel = this._heightmap.getPixel(x, y); // we only use the red component

        let height = pixel[0] / 255 * this._maxHeight;

        return height;
    }

    getNumVertices(): number {
        return (this._widthSegments + 1) * (this._depthSegments + 1);
    }

    getNumTriangles(): number {
        return this._widthSegments * this._depthSegments * 2;
    }

    getStride(): number {
        return this._stride * Float32Array.BYTES_PER_ELEMENT;
    }


    getVertex(x: number, y: number, width: number, depth: number): number[] {
        return [];
    }

    getIndexData(): Uint16Array {
        let indexData: number[] = [];

        // generate the indices for the terrain
        for (let z = 0; z < this._depthSegments; z++) {
            for (let x = 0; x < this._widthSegments; x++) {
                // we add two triangles per quad
                // add the indexes for the first triangle
                indexData.push(x + z * (this._widthSegments + 1));
                indexData.push(x + (z + 1) * (this._widthSegments + 1));
                indexData.push(x + 1 + (z + 1) * (this._widthSegments + 1));
                // add the indexes for the second triangle
                indexData.push(x + z * (this._widthSegments + 1));
                indexData.push(x + 1 + (z + 1) * (this._widthSegments + 1));
                indexData.push(x + 1 + z * (this._widthSegments + 1));
            }

        }

        return new Uint16Array(indexData);
    }

    getVertexData(needTexture: boolean = false): Float32Array {
        const deltaX = this._width / this._widthSegments;
        const deltaZ = this._depth / this._depthSegments;

        let vertexData: number[] = [];
        if (needTexture) {
            this._stride = 5;
        } else {
            this._stride = 3;
        }
        for (let z = 0; z <= this._depthSegments; z++) {
            for (let x = 0; x <= this._widthSegments; x++) {
                // calculate the position of the vertex
                const positionX = x * deltaX;
                const positionZ = z * deltaZ;
                const positionY = this.getHeight(x / this._widthSegments, z / this._depthSegments);

                // add the position to the vertex data
                vertexData.push(positionX);
                vertexData.push(positionY);
                vertexData.push(positionZ);

                if (needTexture) {
                    // add the texture coordinates to the vertex data
                    vertexData.push(x / this._widthSegments);
                    vertexData.push(z / this._depthSegments);
                }

                // // add the normal to the vertex data
                // vertexData.push(0);
                // vertexData.push(1);
                // vertexData.push(0);


            }
        }


        return new Float32Array(vertexData);
    }


}

export default Terrain;
