import LineCube, {
  getNewVertexCount,
  getNewPositions,
  getNewIndices,
  getSharedFaces
} from "./line_cube.js";

/* o-block
  ______
 |     |
 |_____|
 */

var oBlockIdx = [
  [0, 0, 0],
  [0, 1, 0],
  [1, 0, 0],
  [1, 1, 0]
];

const oBlockShared = getSharedFaces(oBlockIdx);
const oBlockSharedCount = oBlockShared.sharedCount;
const oBlockSharedLines = oBlockShared.sharedLines;
const oBlockPositions = getNewPositions(oBlockIdx, oBlockSharedLines);
const oBlockIndices = getNewIndices(oBlockIdx);
const oBlockVertexCount = getNewVertexCount(oBlockIdx, oBlockSharedCount);

export default class oBlock extends LineCube {
  getPositions() {
    return oBlockPositions;
  }
  getIndices() {
    return oBlockIndices;
  }
  getVertexCount() {
    return oBlockVertexCount;
  }
  getBlockIdx() {
    return oBlockIdx;
  }
}
