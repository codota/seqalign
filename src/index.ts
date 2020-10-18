import { needlemanWunsch } from './nw.algorithm';
import { smithWaterman } from './sw.algorithm';
import { AlignerFactory } from './aligner.factory';

const NWaligner = AlignerFactory({
  algorithm: needlemanWunsch,
  similarityScoreFunctionDefault: (char1, char2) => (char1 === char2 ? 1 : -2),
  gapScoreFunctionDefault: () => -1,
  gapSymbolDefault: '-',
});

const SWaligner = AlignerFactory({
  algorithm: smithWaterman,
  similarityScoreFunctionDefault: (char1, char2) => (char1 === char2 ? 2 : -1),
  gapScoreFunctionDefault: (gapLength?: number) => (gapLength ? -gapLength : 0),
  gapSymbolDefault: '-',
});

export { NWaligner, SWaligner };
