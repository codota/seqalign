import { Direction } from './types';
import {
  createMatrix,
  initNWScoringMatrix,
  initNWTracebackMatrix,
  extractColumn,
  extractRow,
} from './matrix.utils';

const matrixFixture = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [1, 2, 3, 4],
  [5, 6, 7, 8],
];

const { LEFT, NONE, UP } = Direction;

describe('Matrix creation', () => {
  it.each([
    [
      { width: 10, height: 3 },
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    ],
    [
      { width: 3, height: 10 },
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    ],
    [
      { width: 3, height: 3 },
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    ],
    [
      { width: 2, height: 2 },
      [
        [0, 0],
        [0, 0],
      ],
    ],
    [{ width: 1, height: 1 }, [[0]]],
    [{ width: 0, height: 0 }, []],
  ])('should return a matrix with the specified dimensions', (input, output) =>
    expect(createMatrix(input)).toEqual(output),
  );
});

describe('Initial matrix creation for Needleman-Wunsch', () => {
  it.each([
    [
      { width: 10, height: 3 },
      [
        [0, -1, -2, -3, -4, -5, -6, -7, -8, -9],
        [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [-2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    ],
    [
      { width: 3, height: 10 },
      [
        [0, -1, -2],
        [-1, 0, 0],
        [-2, 0, 0],
        [-3, 0, 0],
        [-4, 0, 0],
        [-5, 0, 0],
        [-6, 0, 0],
        [-7, 0, 0],
        [-8, 0, 0],
        [-9, 0, 0],
      ],
    ],
    [
      { width: 3, height: 3 },
      [
        [0, -1, -2],
        [-1, 0, 0],
        [-2, 0, 0],
      ],
    ],
    [
      { width: 2, height: 2 },
      [
        [0, -1],
        [-1, 0],
      ],
    ],
    [{ width: 1, height: 1 }, [[0]]],
    [{ width: 0, height: 0 }, []],
  ])(
    'should return a matrix with the specified dimensions and with a negative integer progression buffer',
    (input, output) => expect(initNWScoringMatrix(input)).toEqual(output),
  );
});

describe('Traceback matrix initialization for Needleman-Wunsch', () => {
  it.each([
    [
      { width: 10, height: 3 },
      [
        [NONE, LEFT, LEFT, LEFT, LEFT, LEFT, LEFT, LEFT, LEFT, LEFT],
        [UP, NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE],
        [UP, NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE, NONE],
      ],
    ],
    [
      { width: 3, height: 10 },
      [
        [NONE, LEFT, LEFT],
        [UP, NONE, NONE],
        [UP, NONE, NONE],
        [UP, NONE, NONE],
        [UP, NONE, NONE],
        [UP, NONE, NONE],
        [UP, NONE, NONE],
        [UP, NONE, NONE],
        [UP, NONE, NONE],
        [UP, NONE, NONE],
      ],
    ],
    [
      { width: 3, height: 3 },
      [
        [NONE, LEFT, LEFT],
        [UP, NONE, NONE],
        [UP, NONE, NONE],
      ],
    ],
    [
      { width: 2, height: 2 },
      [
        [NONE, LEFT],
        [UP, NONE],
      ],
    ],
    [{ width: 1, height: 1 }, [[NONE]]],
    [{ width: 0, height: 0 }, []],
  ])(
    'should return a matrix with the specified dimensions and appropriate direction values',
    (input, output) => expect(initNWTracebackMatrix(input)).toEqual(output),
  );
});

describe('Matrix column extraction', () => {
  it('should extract two elements from the third column', () => {
    const extractedColumn = extractColumn({
      matrix: matrixFixture,
      row: 1,
      col: 2,
    });
    expect(extractedColumn).toEqual([3, 7]);
  });
  it('should extract the whole first column', () => {
    const extractedColumn = extractColumn({
      matrix: matrixFixture,
      row: 3,
      col: 0,
    });
    expect(extractedColumn).toEqual([1, 5, 1, 5]);
  });
});

describe('Matrix row extraction', () => {
  it('should extract the first two elements from the third row', () => {
    const extractedColumn = extractRow({
      matrix: matrixFixture,
      row: 2,
      col: 1,
    });
    expect(extractedColumn).toEqual([1, 2]);
  });
  it('should extract the whole first row', () => {
    const extractedColumn = extractRow({
      matrix: matrixFixture,
      row: 0,
      col: 3,
    });
    expect(extractedColumn).toEqual([1, 2, 3, 4]);
  });
});
