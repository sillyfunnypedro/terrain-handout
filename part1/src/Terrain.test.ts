import Terrain from './Terrain';
import FilePPM from './FilePPM';
import fs from 'fs';


// get the current directory
let cwd: string = process.cwd();
let testPath: string = cwd + '/media/test';
let height_image: string = cwd + '/media/gradient.ppm';
let ppmFile: FilePPM;


beforeAll(() => {
    ppmFile = new FilePPM(height_image);

});

describe('Terrain', () => {
    test('constructor', () => {
        const terrain = new Terrain();
        terrain.setParameters(ppmFile, 1, 1, 1, 1, 1);
        expect(terrain).toBeDefined();
    });

    test('getHeight-1', () => {
        const terrain = new Terrain();
        terrain.setParameters(ppmFile, 1, 1, 1, 1, 1);
        const height = terrain.getHeight(0, 0);
        expect(height).toBe(1);
    });

    test('getHeight-0', () => {
        const terrain = new Terrain();
        terrain.setParameters(ppmFile, 1, 1, 1, 1, 1);
        const height = terrain.getHeight(0, 1);
        expect(height).toBe(0);
    });

    test('getHeight-0.5', () => {
        const terrain = new Terrain();
        terrain.setParameters(ppmFile, 1, 1, 1, 1, 1);
        const height = terrain.getHeight(0.5, 0.5);
        expect(height).toBe(0.4980392156862745);
    });

    // test('one square', () => {
    //     const terrain = new Terrain();
    //     terrain.setParameters(ppmFile, 10, 10, 1, 1, 1);
    //     const vertexData = terrain.getVertexData();
    //     expect(vertexData.length).toBe(20);

    // });
    // test('one square', () => {
    //     const terrain = new Terrain();
    //     terrain.setParameters(ppmFile, 10, 10, 2, 2, 1);
    //     const vertexData = terrain.getVertexData();
    //     expect(vertexData.length).toBe(45);

    // });


});

