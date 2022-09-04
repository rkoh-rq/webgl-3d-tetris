import LineCube, {
  getNewVertexCount,
  getNewPositions,
  getNewIndices,
  getSharedFaces
} from "./line_cube.js";

/* i-block
  _________
 |________|
 */

var iBlockIdx = [
  [0, -2, 0],
  [0, -1, 0],
  [0, 0, 0],
  [0, 1, 0]
];

const iBlockShared = getSharedFaces(iBlockIdx);
const iBlockSharedCount = iBlockShared.sharedCount;
const iBlockSharedLines = iBlockShared.sharedLines;
const iBlockPositions = getNewPositions(iBlockIdx, iBlockSharedLines);
const iBlockIndices = getNewIndices(iBlockIdx);
const iBlockVertexCount = getNewVertexCount(iBlockIdx, iBlockSharedCount);

export default class iBlock extends LineCube {
  getPositions() {
    return iBlockPositions;
  }
  getIndices() {
    return iBlockIndices;
  }
  getVertexCount() {
    return iBlockVertexCount;
  }
  getBlockIdx() {
    return iBlockIdx;
  }
}
