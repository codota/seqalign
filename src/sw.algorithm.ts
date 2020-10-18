import { createMatrix, extractColumn, extractRow } from './matrix.utils';
import { AlignmentAlgorithm, Direction, DirectionScore, GapScoreFunction, Matrix } from './types';

interface Gap {
  length: number;
  score: number;
}

// Takes a list representing a portion of scoring matrix (left-row or top-column)
// and computes the length of a gap if the gap is opened at that position.
// Returns the maximum score in the sequence and the maximum gap length.
function computeGap(sequence: number[]): Gap {
  let score = -1;
  let length = 0;

  for (let cursor = 1; cursor < sequence.length; cursor += 1) {
    if (sequence[cursor] > score) {
      score = sequence[cursor];
      length = cursor;
    }
  }

  return { score, length };
}

interface ComputeScoresArgs {
  scoringMatrix: Matrix<number>;
  row: number;
  col: number;
  similarityScore: number;
  gapScoreFunction: GapScoreFunction;
}

// Compute candidate scores to fill a certain cell of the scoring matrix.
// Returns a list of ScoredDirection storing score value and traceback direction.
function computeScores({
  scoringMatrix,
  row,
  col,
  gapScoreFunction,
  similarityScore,
}: ComputeScoresArgs): [DirectionScore, DirectionScore, DirectionScore] {
  // Get left-row and top-column from the current coordinates.
  const leftSequence = extractRow({ matrix: scoringMatrix, row, col });
  const topSequence = extractColumn({ matrix: scoringMatrix, row, col });

  // Compute left and top maximum values and gap lengths.
  const leftGap = computeGap(leftSequence.reverse());
  const upGap = computeGap(topSequence.reverse());

  return [
    // Deletion score.
    { score: upGap.score + gapScoreFunction(upGap.length), direction: Direction.UP },
    // Insertion score.
    { score: leftGap.score + gapScoreFunction(leftGap.length), direction: Direction.LEFT },
    // Mutation score.
    { score: scoringMatrix[row - 1][col - 1] + similarityScore, direction: Direction.DIAGONAL },
  ];
}

const smithWaterman: AlignmentAlgorithm = ({
  sequence1,
  sequence2,
  gapScoreFunction,
  similarityScoreFunction,
}) => {
  // Initialize matrices for dynamic programming solution.
  const height = sequence1.length + 1;
  const width = sequence2.length + 1;
  const scoringMatrix: Matrix<number> = createMatrix({ width, height });
  const tracebackMatrix: Matrix<Direction> = createMatrix({ width, height, fill: Direction.NONE });

  let scoringMax = 0;
  let scoringMaxCoordinates: [number, number] = [0, 0];

  // Fill the matrices.
  for (let row = 1; row < height; row += 1) {
    for (let col = 1; col < width; col += 1) {
      // Simlarity score of the current couple of characters in the
      // input sequences. Subtracts 1 from matrix coordinates to account
      // for the matrix buffer.
      const similarityScore = similarityScoreFunction(sequence1[row - 1], sequence2[col - 1]);

      // Candidate scores to fill the current matrix cell.
      const directionScores = computeScores({
        scoringMatrix,
        row,
        col,
        gapScoreFunction,
        similarityScore,
      });

      // Select highest scoring substitution and fill the matrices.
      const currentScore = directionScores.reduce((highest, current) =>
        highest.score > current.score ? highest : current,
      );
      scoringMatrix[row][col] = currentScore.score;
      tracebackMatrix[row][col] = currentScore.direction;

      // Keep record of the highest score in the scoring matrix.
      if (currentScore.score >= scoringMax) {
        scoringMax = currentScore.score;
        scoringMaxCoordinates = [row, col];
      }
    }
  }

  return {
    alignmentScore: scoringMax,
    scoringMatrix,
    tracebackMatrix,
    tracebackStart: scoringMaxCoordinates,
  };
};

export { smithWaterman };
