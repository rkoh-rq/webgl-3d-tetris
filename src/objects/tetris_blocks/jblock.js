import LineCube, {
  getNewVertexCount,
  getNewPositions,
  getNewIndices,
  getSharedFaces
} from "./line_cube.js";

/* j-block
  ________
 |____   |
      |__|
 */

var jBlockIdx = [
  [0, -1, 0],
  [0, 0, 0],
  [0, 1, 0],
  [1, 1, 0]
];

const jBlockShared = getSharedFaces(jBlockIdx);
const jBlockSharedCount = jBlockShared.sharedCount;
const jBlockSharedLines = jBlockShared.sharedLines;
const jBlockPositions = getNewPositions(jBlockIdx, jBlockSharedLines);
const jBlockIndices = getNewIndices(jBlockIdx);
const jBlockVertexCount = getNewVertexCount(jBlockIdx, jBlockSharedCount);

export default class jBlock extends LineCube {
  getPositions() {
    return jBlockPositions;
  }
  getIndices() {
    return jBlockIndices;
  }
  getVertexCount() {
    return jBlockVertexCount;
  }
  getBlockIdx() {
    return jBlockIdx;
  }
}
