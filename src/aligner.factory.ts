import {
  AlignmentAlgorithm,
  Direction,
  GapScoreFunction,
  Matrix,
  SimilarityScoreFunction,
} from './types';
import { traceback } from './traceback';

interface AlignerFactoryConfiguration {
  algorithm: AlignmentAlgorithm;
  similarityScoreFunctionDefault: SimilarityScoreFunction;
  gapScoreFunctionDefault: GapScoreFunction;
  gapSymbolDefault: string;
}

interface AlignerConfiguration {
  algorithm: AlignmentAlgorithm;
  similarityScoreFunction: SimilarityScoreFunction;
  gapScoreFunction: GapScoreFunction;
  gapSymbol: string;
}

interface Alignment {
  score: number;
  originalSequences: [string, string];
  alignedSequences: [string, string];
  coordinateWalk: [number, number][];
  scoringMatrix: Matrix<number>;
  tracebackMatrix: Matrix<Direction>;
  alignment: string;
}

interface Aligner {
  similarityScoreFunction: SimilarityScoreFunction;
  gapScoreFunction: GapScoreFunction;
  gapSymbol: string;
  align(sequence1: string, sequence2: string): Alignment;
}
const Aligner = ({
  algorithm,
  similarityScoreFunction,
  gapScoreFunction,
  gapSymbol,
}: AlignerConfiguration): Aligner => ({
  similarityScoreFunction,
  gapScoreFunction,
  gapSymbol,
  align(sequence1 = '', sequence2 = '') {
    const { alignmentScore, scoringMatrix, tracebackMatrix, tracebackStart } = algorithm({
      sequence1,
      sequence2,
      gapScoreFunction: this.gapScoreFunction,
      similarityScoreFunction: this.similarityScoreFunction,
    });

    const { alignedSequence1, alignedSequence2, coordinateWalk } = traceback({
      sequence1,
      sequence2,
      tracebackMatrix,
      tracebackStart,
      gapSymbol: this.gapSymbol,
    });

    return {
      score: alignmentScore,
      originalSequences: [sequence1, sequence2],
      alignedSequences: [alignedSequence1, alignedSequence2],
      coordinateWalk,
      scoringMatrix,
      tracebackMatrix,
      alignment: `${alignedSequence1}\n${alignedSequence2}`,
    };
  },
});

const AlignerFactory = ({
  algorithm,
  similarityScoreFunctionDefault,
  gapScoreFunctionDefault,
  gapSymbolDefault,
}: AlignerFactoryConfiguration) => ({
  similarityScoreFunction = similarityScoreFunctionDefault,
  gapScoreFunction = gapScoreFunctionDefault,
  gapSymbol = gapSymbolDefault,
} = {}): Aligner => Aligner({ algorithm, similarityScoreFunction, gapScoreFunction, gapSymbol });

export { Aligner, AlignerFactory };
