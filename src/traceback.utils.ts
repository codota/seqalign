import { Direction } from './types';

interface GetNewCharsArgs {
  direction: Direction;
  gapSymbol: string;
  sequence1: string;
  sequence2: string;
  row: number;
  col: number;
}
const getNewChars = ({
  direction,
  gapSymbol,
  sequence1,
  sequence2,
  row,
  col,
}: GetNewCharsArgs): [string, string] => {
  const newChars: Record<Partial<Direction>, [string, string]> = {
    [Direction.DIAGONAL]: [sequence1[row - 1], sequence2[col - 1]],
    [Direction.LEFT]: [gapSymbol, sequence2[col - 1]],
    [Direction.UP]: [sequence1[row - 1], gapSymbol],
    [Direction.NONE]: [sequence1[row], sequence2[col]],
  };

  return newChars[direction];
};

interface GetNextCoordinatesArgs {
  direction: Direction;
  currentRow: number;
  currentCol: number;
}
const getNextCoordinates = ({
  direction,
  currentCol,
  currentRow,
}: GetNextCoordinatesArgs): [number, number] => {
  const newCoordinates: Record<Direction, [number, number]> = {
    [Direction.DIAGONAL]: [currentRow - 1, currentCol - 1],
    [Direction.LEFT]: [currentRow, currentCol - 1],
    [Direction.UP]: [currentRow - 1, currentCol],
    [Direction.NONE]: [currentRow, currentCol],
  };

  return newCoordinates[direction];
};

export { getNewChars, getNextCoordinates };
