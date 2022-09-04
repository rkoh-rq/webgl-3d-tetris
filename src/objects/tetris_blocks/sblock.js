import LineCube, {
  getNewVertexCount,
  getNewPositions,
  getNewIndices,
  getSharedFaces
} from "./line_cube.js";

/* s-block || z-block (same in 3d)
      _____
   __|   __|
  |_____|
 */

var sBlockIdx = [
  [0, -1, 0],
  [0, 0, 0],
  [1, 0, 0],
  [1, 1, 0]
];
const sBlockShared = getSharedFaces(sBlockIdx);
const sBlockSharedCount = sBlockShared.sharedCount;
const sBlockSharedLines = sBlockShared.sharedLines;
const sBlockPositions = getNewPositions(sBlockIdx, sBlockSharedLines);
const sBlockIndices = getNewIndices(sBlockIdx);
const sBlockVertexCount = getNewVertexCount(sBlockIdx, sBlockSharedCount);

export default class sBlock extends LineCube {
  getPositions() {
    return sBlockPositions;
  }
  getIndices() {
    return sBlockIndices;
  }
  getVertexCount() {
    return sBlockVertexCount;
  }
  getBlockIdx() {
    return sBlockIdx;
  }
}
