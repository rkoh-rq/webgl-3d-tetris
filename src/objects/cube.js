const { mat4 } = require("gl-matrix");

export const positions_length = 24;
const positions = [
  // Front face
  -0.5,
  -0.5,
  0.5,
  0.5,
  -0.5,
  0.5,
  0.5,
  0.5,
  0.5,
  -0.5,
  0.5,
  0.5,

  // Back face
  -0.5,
  -0.5,
  -0.5,
  -0.5,
  0.5,
  -0.5,
  0.5,
  0.5,
  -0.5,
  0.5,
  -0.5,
  -0.5,

  // Top face
  -0.5,
  0.5,
  -0.5,
  -0.5,
  0.5,
  0.5,
  0.5,
  0.5,
  0.5,
  0.5,
  0.5,
  -0.5,

  // Bottom face
  -0.5,
  -0.5,
  -0.5,
  0.5,
  -0.5,
  -0.5,
  0.5,
  -0.5,
  0.5,
  -0.5,
  -0.5,
  0.5,

  // Right face
  0.5,
  -0.5,
  -0.5,
  0.5,
  0.5,
  -0.5,
  0.5,
  0.5,
  0.5,
  0.5,
  -0.5,
  0.5,

  // Left face
  -0.5,
  -0.5,
  -0.5,
  -0.5,
  -0.5,
  0.5,
  -0.5,
  0.5,
  0.5,
  -0.5,
  0.5,
  -0.5
];

// This array defines each face as two triangles, using the
// indices into the vertex array to specify each triangle's
// position.

const indices = [
  0,
  1,
  2,
  0,
  2,
  3, // front
  4,
  5,
  6,
  4,
  6,
  7, // back
  8,
  9,
  10,
  8,
  10,
  11, // top
  12,
  13,
  14,
  12,
  14,
  15, // bottom
  16,
  17,
  18,
  16,
  18,
  19, // right
  20,
  21,
  22,
  20,
  22,
  23 // left
];

export const vertexCount = 36;

export default class Cube {
  constructor(color) {
    this.color = color;
  }

  getColors() {
    var colors = [];
    for (let i = 0; i < positions_length; i++) {
      colors.push(this.color[0], this.color[1], this.color[2], this.color[3]);
    }
    return colors;
  }

  linesOnly() {
    return false;
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

export function getNewPositions(blockIdx) {
  var newPositions = [];
  var x;
  var y;
  var z;
  for (let i = 0; i < blockIdx.length; i++) {
    for (let j = 0; j < positions.length; j += 3) {
      x = positions[j] + blockIdx[i][0];
      y = positions[j + 1] + blockIdx[i][1];
      z = positions[j + 2] + blockIdx[i][2];
      newPositions.push(x, y, z);
    }
  }
  return newPositions;
}

export function getNewIndices(blockIdx) {
  var newIndices = [];
  for (let i = 0; i < blockIdx.length; i++) {
    for (let j = 0; j < indices.length; j++) {
      newIndices.push(indices[j] + (i * positions.length) / 3);
    }
  }
  return newIndices;
}

export function getNewVertexCount(blockIdx) {
  return vertexCount * blockIdx.length;
}
