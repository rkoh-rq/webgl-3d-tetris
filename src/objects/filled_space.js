import Cube, {
  positions_length,
  getNewVertexCount,
  getNewPositions,
  getNewIndices
} from "./cube.js";

export default class FilledSpace extends Cube {
  constructor(color, rainbow) {
    super(color);
    this.rainbow = rainbow;
    this.blockIdx = [];
  }

  getColors() {
    var colors = [];
    var z;
    for (let i = 0; i < this.blockIdx.length; i++) {
      z = this.blockIdx[i][2];
      for (let j = 0; j < positions_length; j++) {
        colors.push(
          this.rainbow[z][0],
          this.rainbow[z][1],
          this.rainbow[z][2],
          this.rainbow[z][3]
        );
      }
    }
    return colors;
  }

  update(blockIdx) {
    this.blockIdx = blockIdx;
    this.positions = getNewPositions(this.blockIdx);
    this.indices = getNewIndices(this.blockIdx);
    this.vertexCount = getNewVertexCount(this.blockIdx);
  }

  getPositions() {
    return this.positions;
  }
  getIndices() {
    return this.indices;
  }
  getVertexCount() {
    return this.vertexCount;
  }
  getBlockIdx() {
    return this.blockIdx;
  }
}
