enum Direction {
  NONE = 0,
  DIAGONAL = 1,
  LEFT = 2,
  UP = 3,
}

interface DirectionScore {
  score: number;
  direction: Direction;
}

interface MatrixDimensions {
  width: number;
  height: number;
}

interface MatrixCell<T> {
  matrix: Matrix<T>;
  row: number;
  col: number;
}

type Matrix<T> = T[][];

interface GapScoreFunction {
  (gapLength?: number): number;
}

interface SimilarityScoreFunction {
  (char1: string, char2: string): number;
}

interface AlignmentInput {
  sequence1: string;
  sequence2: string;
  gapScoreFunction: GapScoreFunction;
  similarityScoreFunction: SimilarityScoreFunction;
}

interface AlignmentResult {
  alignmentScore: number;
  scoringMatrix: Matrix<number>;
  tracebackMatrix: Matrix<Direction>;
  tracebackStart: [number, number];
}

interface AlignmentAlgorithm {
  (args: AlignmentInput): AlignmentResult;
}

export {
  AlignmentAlgorithm,
  Direction,
  DirectionScore,
  GapScoreFunction,
  Matrix,
  MatrixCell,
  MatrixDimensions,
  SimilarityScoreFunction,
};
