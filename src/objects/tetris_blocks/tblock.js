import LineCube, {
  getNewVertexCount,
  getNewPositions,
  getNewIndices,
  getSharedFaces
} from "./line_cube.js";

/* t-block
  ________
 |__    __|
    |__|
 */

var tBlockIdx = [
  [-1, 0, 0],
  [0, 0, 0],
  [0, 1, 0],
  [1, 0, 0]
];

const tBlockShared = getSharedFaces(tBlockIdx);
const tBlockSharedCount = tBlockShared.sharedCount;
const tBlockSharedLines = tBlockShared.sharedLines;
const tBlockPositions = getNewPositions(tBlockIdx, tBlockSharedLines);
const tBlockIndices = getNewIndices(tBlockIdx);
const tBlockVertexCount = getNewVertexCount(tBlockIdx, tBlockSharedCount);

export default class tBlock extends LineCube {
  getPositions() {
    return tBlockPositions;
  }
  getIndices() {
    return tBlockIndices;
  }
  getVertexCount() {
    return tBlockVertexCount;
  }
  getBlockIdx() {
    return tBlockIdx;
  }
}
