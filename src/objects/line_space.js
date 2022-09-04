import LineCube, {
  getNewVertexCount,
  getNewPositions
} from "./tetris_blocks/line_cube.js";

export default class LineSpace extends LineCube {
  constructor(color) {
    super(color);
    this.blockIdx = [];
  }

  update(blockIdx) {
    this.blockIdx = blockIdx;
    this.positions = getNewPositions(this.blockIdx, []);
    this.vertexCount = getNewVertexCount(this.blockIdx, 0);
  }

  getPositions() {
    return this.positions;
  }

  getIndices() {
    return;
  }
  getVertexCount() {
    return this.vertexCount;
  }
  getBlockIdx() {
    return this.blockIdx;
  }
}
