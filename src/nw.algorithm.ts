import { initNWScoringMatrix, initNWTracebackMatrix } from './matrix.utils';
import { AlignmentAlgorithm, Direction, DirectionScore } from './types';

const needlemanWunsch: AlignmentAlgorithm = ({
  sequence1,
  sequence2,
  gapScoreFunction,
  similarityScoreFunction,
}) => {
  // Initialize matrices for dynamic programming solution.
  const height = sequence1.length + 1;
  const width = sequence2.length + 1;
  const scoringMatrix = initNWScoringMatrix({ width, height });
  const tracebackMatrix = initNWTracebackMatrix({ width, height });

  let lastScore = 0;
  let lastCoordinates: [number, number] = [0, 0];

  // Fill the matrices.
  for (let row = 1; row < height; row += 1) {
    for (let col = 1; col < width; col += 1) {
      // Simlarity score of the current couple of characters in the
      // input sequences. Subtracts 1 from matrix coordinates to account
      // for the matrix buffer.
      const similarityScore = similarityScoreFunction(sequence1[row - 1], sequence2[col - 1]);

      // Candidate scores to fill the current matrix cell.
      const directionScores: [DirectionScore, DirectionScore, DirectionScore] = [
        { score: scoringMatrix[row - 1][col] + gapScoreFunction(), direction: Direction.UP },
        { score: scoringMatrix[row][col - 1] + gapScoreFunction(), direction: Direction.LEFT },
        { score: scoringMatrix[row - 1][col - 1] + similarityScore, direction: Direction.DIAGONAL },
      ];

      // Select highest scoring substitution and fill the matrices.
      const currentScore = directionScores.reduce((highest, current) =>
        highest.score > current.score ? highest : current,
      );
      scoringMatrix[row][col] = currentScore.score;
      tracebackMatrix[row][col] = currentScore.direction;
      lastScore = currentScore.score;
      lastCoordinates = [row, col];
    }
  }

  return {
    alignmentScore: lastScore,
    scoringMatrix,
    tracebackMatrix,
    tracebackStart: lastCoordinates,
  };
};

export { needlemanWunsch };
