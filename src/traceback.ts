import { getNewChars, getNextCoordinates } from './traceback.utils';
import { Direction, Matrix } from './types';

interface TracebackArgs {
  sequence1: string;
  sequence2: string;
  tracebackMatrix: Matrix<Direction>;
  tracebackStart: [number, number];
  gapSymbol: string;
}

interface TracebackResult {
  alignedSequence1: string;
  alignedSequence2: string;
  coordinateWalk: [number, number][];
}

const traceback = ({
  sequence1,
  sequence2,
  tracebackMatrix,
  tracebackStart,
  gapSymbol,
}: TracebackArgs): TracebackResult => {
  let [row, col] = tracebackStart;
  let alignedSequence1: string[] = [];
  let alignedSequence2: string[] = [];
  const coordinateWalk: [number, number][] = [[row, col]];

  while (tracebackMatrix[row][col] !== Direction.NONE) {
    const direction = tracebackMatrix[row][col];
    const [char1, char2] = getNewChars({ direction, gapSymbol, sequence1, sequence2, row, col });
    alignedSequence1 = [char1, ...alignedSequence1];
    alignedSequence2 = [char2, ...alignedSequence2];
    [row, col] = getNextCoordinates({ direction, currentRow: row, currentCol: col });
    coordinateWalk.push([row, col]);
  }

  return {
    alignedSequence1: alignedSequence1.join(''),
    alignedSequence2: alignedSequence2.join(''),
    coordinateWalk,
  };
};

export { traceback };
