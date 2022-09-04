import FilledSpace from "./filled_space";
import LineSpace from "./line_space";
import getRainbow from "./rainbow";

const { mat4 } = require("gl-matrix");

export default class Space {
  constructor(spaceSize) {
    this.spaceSize = spaceSize;
    this.objectOffset = [
      Math.floor(this.spaceSize.x / 2),
      Math.floor(this.spaceSize.y / 2),
      0
    ];
    this.zCube = new Array(spaceSize.z);
    for (let i = 0; i < spaceSize.z; i++) {
      this.zCube[i] = new Array(spaceSize.y);
      for (let j = 0; j < spaceSize.y; j++) {
        this.zCube[i][j] = Array(spaceSize.x).fill(0);
      }
    }
    this.filled = [];
    this.lineSpace = new LineSpace([0, 0, 0, 1]);
    this.filledSpace = new FilledSpace(
      [1, 0, 0, 1],
      getRainbow(this.spaceSize.z)
    );
  }

  getFilledArray() {
    return this.filled;
  }

  getPositions() {
    var positions = [];
    for (let i = 0; i < this.spaceSize.x + 1; i++) {
      positions.push(
        i,
        0,
        0,
        i,
        0,
        this.spaceSize.z,
        i,
        this.spaceSize.x,
        0,
        i,
        this.spaceSize.x,
        this.spaceSize.z
      );
    }
    for (let i = 0; i < this.spaceSize.y + 1; i++) {
      positions.push(
        0,
        i,
        0,
        0,
        i,
        this.spaceSize.z,
        this.spaceSize.y,
        i,
        0,
        this.spaceSize.y,
        i,
        this.spaceSize.z
      );
    }
    for (let i = 0; i < this.spaceSize.z + 1; i++) {
      positions.push(
        0,
        0,
        i,
        0,
        this.spaceSize.y,
        i,
        this.spaceSize.x,
        0,
        i,
        this.spaceSize.x,
        this.spaceSize.y,
        i
      );
      positions.push(
        0,
        0,
        i,
        this.spaceSize.x,
        0,
        i,
        0,
        this.spaceSize.y,
        i,
        this.spaceSize.x,
        this.spaceSize.y,
        i
      );
    }
    return positions;
  }

  getVertexCount() {
    return (
      4 * (this.spaceSize.x + 1) +
      4 * (this.spaceSize.y + 1) +
      8 * (this.spaceSize.z + 1)
    );
  }

  getColors() {
    var colors = [];
    for (let i = 0; i < this.getVertexCount(); i++) {
      colors.push(0, 0.6, 0, 1);
    }
    return colors;
  }

  getCentralizeTransform() {
    const transform = mat4.create();
    mat4.translate(transform, transform, [
      -this.spaceSize.x / 2,
      -this.spaceSize.y / 2,
      -0.5
    ]);
    return transform;
  }

  getCentralizeObjectsTransform() {
    const transform = mat4.create();
    mat4.translate(transform, transform, [
      -this.spaceSize.x / 2 + 0.5,
      -this.spaceSize.y / 2 + 0.5,
      0
    ]);
    return transform;
  }

  checkSpaceIsFilled(element) {
    if (element[2] < 0) {
      return false;
    } else if (this.zCube[element[2]][element[1]][element[0]]) {
      return true;
    }
    return false;
  }

  checkIsOutsideSpace(element) {
    return (
      element[0] >= this.spaceSize.x ||
      element[0] < 0 ||
      element[1] >= this.spaceSize.y ||
      element[1] < 0 ||
      element[2] >= this.spaceSize.z
    );
  }

  objectCanMove(movingObject) {
    return !(
      movingObject.some(this.checkIsOutsideSpace, this) ||
      movingObject.some(this.checkSpaceIsFilled, this)
    );
  }

  fillSpace(position) {
    this.zCube[position[2] - 1][position[1]][position[0]] = 1;
    this.filled.push([position[0], position[1], position[2] - 1]);
  }

  removeIfLayerFilled(position) {
    const z = position[2] - 1;
    const isFull = !this.zCube[z].some((row) => row.some((e) => e === 0));
    if (isFull) {
      this.zCube.splice(z, 1);
      this.zCube.unshift(new Array(this.spaceSize.y));
      for (let i = 0; i < this.spaceSize.y; i++) {
        this.zCube[0][i] = Array(this.spaceSize.x).fill(0);
      }
      var offset = 0;
      var length = this.filled.length;
      for (let i = 0; i < length; i++) {
        if (this.filled[i - offset][2] === z) {
          this.filled.splice(i - offset, 1);
          offset += 1;
        } else if (this.filled[i - offset][2] < z) {
          this.filled[i - offset][2] += 1;
        }
      }
    }
  }

  add(accumulator, a) {
    return accumulator + a;
  }

  objectEndMove(movingObject) {
    movingObject.forEach(this.fillSpace, this);
    movingObject.forEach(this.removeIfLayerFilled, this);
  }

  tryMoveDown(movingObject) {
    if (!this.objectCanMove(movingObject)) {
      this.objectEndMove(movingObject);
      this.lineSpace.update(this.filled);
      this.filledSpace.update(this.filled);
      return false;
    }
    return true;
  }
}
