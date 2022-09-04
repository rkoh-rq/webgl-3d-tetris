const { mat4 } = require("gl-matrix");

const positions = [
  // Front Top
  0.5,
  0.5,
  0.5,
  -0.5,
  0.5,
  0.5,

  // Front Bottom
  -0.5,
  -0.5,
  0.5,
  0.5,
  -0.5,
  0.5,

  // Front Left
  -0.5,
  0.5,
  0.5,
  -0.5,
  -0.5,
  0.5,

  // Front Right
  0.5,
  -0.5,
  0.5,
  0.5,
  0.5,
  0.5,

  // Back Top
  -0.5,
  0.5,
  -0.5,
  0.5,
  0.5,
  -0.5,

  // Back Bottom
  0.5,
  -0.5,
  -0.5,
  -0.5,
  -0.5,
  -0.5,

  // Back Left
  -0.5,
  -0.5,
  -0.5,
  -0.5,
  0.5,
  -0.5,

  // Back Right
  0.5,
  0.5,
  -0.5,
  0.5,
  -0.5,
  -0.5,

  // Top Left
  -0.5,
  0.5,
  -0.5,
  -0.5,
  0.5,
  0.5,

  // Top Right
  0.5,
  0.5,
  0.5,
  0.5,
  0.5,
  -0.5,

  // Bottom Left
  -0.5,
  -0.5,
  0.5,
  -0.5,
  -0.5,
  -0.5,

  // Bottom Right
  0.5,
  -0.5,
  -0.5,
  0.5,
  -0.5,
  0.5
];

// This array defines each face as two triangles, using the
// indices into the vertex array to specify each triangle's
// position.

const indices = [];

const vertexCount = 48;

export default class LineCube {
  constructor(color) {
    this.color = color;
  }

  getColors() {
    var colors = [];
    for (let i = 0; i < this.getVertexCount(); i++) {
      colors.push(this.color[0], this.color[1], this.color[2], this.color[3]);
    }
    return colors;
  }

  linesOnly() {
    return true;
  }

  getPositions() {
    return positions;
  }

  getIndices() {
    return indices;
  }
  getVertexCount() {
    return vertexCount;
  }

  getBlockIdx() {
    return [[0, 0, 0]];
  }
}

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

export function getSharedFaces(blockIdx) {
  var sharedLines = {};
  var sharedCount = 0;
  var front;
  var right;
  var top;
  var hasFront;
  var hasTop;
  var hasRight;
  for (let i = 0; i < blockIdx.length; i++) {
    sharedLines[blockIdx[i]] = [];
  }
  for (let i = 0; i < blockIdx.length; i++) {
    front = [blockIdx[i][0], blockIdx[i][1], blockIdx[i][2] + 1];
    top = [blockIdx[i][0], blockIdx[i][1] + 1, blockIdx[i][2]];
    right = [blockIdx[i][0] + 1, blockIdx[i][1], blockIdx[i][2]];

    hasFront = blockIdx.some((e) => arrayEquals(e, front));
    hasTop = blockIdx.some((e) => arrayEquals(e, top));
    hasRight = blockIdx.some((e) => arrayEquals(e, right));

    if (hasFront) {
      sharedLines[blockIdx[i]].push(0, 1, 2, 3);
      sharedLines[front].push(4, 5, 6, 7);
      sharedCount += 8;
    }
    if (hasTop) {
      sharedLines[blockIdx[i]].push(0, 4, 8, 9);
      sharedLines[top].push(1, 5, 10, 11);
      sharedCount += 8 - hasFront * 2;
    }
    if (hasRight) {
      sharedLines[blockIdx[i]].push(3, 7, 9, 11);
      sharedLines[right].push(2, 6, 8, 10);
      sharedCount += 8 - hasFront * 2 - hasTop * 2;
    }
  }
  return { sharedCount, sharedLines };
}

export function getNewPositions(blockIdx, sharedLines) {
  var newPositions = [];
  var x;
  var y;
  var z;
  var a;
  var b;
  var c;
  for (let i = 0; i < blockIdx.length; i++) {
    for (let j = 0; j < positions.length; j += 6) {
      if (
        sharedLines.length === 0 ||
        !sharedLines[blockIdx[i]].includes(j / 6)
      ) {
        x = positions[j] + blockIdx[i][0];
        y = positions[j + 1] + blockIdx[i][1];
        z = positions[j + 2] + blockIdx[i][2];
        a = positions[j + 3] + blockIdx[i][0];
        b = positions[j + 4] + blockIdx[i][1];
        c = positions[j + 5] + blockIdx[i][2];
        newPositions.push(x, y, z, a, b, c);
      }
    }
  }
  return newPositions;
}

export function getNewIndices(blockIdx) {
  return indices;
}

export function getNewVertexCount(blockIdx, sharedCount) {
  return vertexCount * blockIdx.length - sharedCount * 2;
}
