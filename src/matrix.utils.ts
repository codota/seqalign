import { Direction, Matrix, MatrixCell, MatrixDimensions } from './types';

// Creates a matrix of the specified width and length.
// First row and column are filled with a negative integer progression starting
// from 0 at coordinates (0, 0). The remaining cells are filled with zeros.
const initNWScoringMatrix = ({ width, height }: MatrixDimensions): Matrix<number> => {
  const matrix = [];
  for (let row = 0; row < height; row += 1) {
    if (row === 0) {
      matrix[row] = Array(width)
        .fill(0)
        .map((_, i) => -i || 0);
    } else {
      matrix[row] = Array(width).fill(0);
      matrix[row][0] = -row;
    }
  }
  return matrix;
};

// Creates a matrix of the specified width and length.
// The top row buffer is filled with the value for Direction.LEFT.
// The left column buffer is filled with the value for Direction.TOP.
// The top-left corner cell is filled with the value for Direction.NONE.
const initNWTracebackMatrix = ({ width, height }: MatrixDimensions): Matrix<Direction> => {
  const matrix = [];
  for (let row = 0; row < height; row += 1) {
    if (row === 0) {
      matrix[row] = Array(width).fill(Direction.LEFT);
    } else {
      matrix[row] = Array(width).fill(Direction.NONE);
      matrix[row][0] = Direction.UP;
    }
    matrix[0][0] = Direction.NONE;
  }
  return matrix;
};

// Creates a matrix of the specified width and length filled with the supplied
// fill value.
type CreateMatrixArgs = MatrixDimensions & { fill?: number };
const createMatrix = ({ width, height, fill = 0 }: CreateMatrixArgs): Matrix<number> =>
  Array.from({ length: height }, () => Array(width).fill(fill));

// Returns the left portion of the row specified by the supplied coordinates.
const extractRow = ({ matrix, row, col }: MatrixCell<number>): number[] =>
  matrix[row].slice(0, col + 1);

// Return the top portion of the column specified by the supplied coordinates.
const extractColumn = ({ matrix, row, col }: MatrixCell<number>): number[] =>
  matrix
    .slice(0, row + 1)
    .map((_row) => _row.slice(col, col + 1))
    .reduce((prev, curr) => [...prev, ...curr], []);

export { createMatrix, extractColumn, extractRow, initNWScoringMatrix, initNWTracebackMatrix };
