const { mat4, vec3 } = require("gl-matrix");

var rotationMatrix = mat4.create();
var axisX = vec3.fromValues(1, 0, 0);
var axisY = vec3.fromValues(0, 1, 0);
var translateX = vec3.fromValues(1, 0, 0);
var translateY = vec3.fromValues(0, 1, 0);
var translateZ = vec3.fromValues(0, 0, 1);
var rotationStep = Math.PI / 2;

var validatedRotationMatrix = mat4.create();
var validatedTranslationVector = vec3.fromValues(0, 0, 0);

var transformMatrix = mat4.create();
var validatedTransformMatrix = mat4.create();

var translationVector = vec3.fromValues(0, 0, 0);

export function getOffsetTransform(spaceSize) {
  var offsetTransform = mat4.create();
  mat4.translate(offsetTransform, offsetTransform, [
    0.5 - 0.5 * (spaceSize.x % 2), // 0.5 if even
    0.5 - 0.5 * (spaceSize.y % 2), // 0.5 if even
    0
  ]);
  return offsetTransform;
}

function resetPosition() {
  rotationMatrix = mat4.create();
  translationVector = vec3.fromValues(0, 0, 0);
  validatedRotationMatrix = mat4.create();
  validatedTranslationVector = vec3.fromValues(0, 0, 0);
}

export function checkKeyDown(e, world) {
  var tempMatrix = mat4.create();
  switch (e.keyCode) {
    case 67: // C ie go down
      moveDown(world);
      return;
    case 82: // Reset
      resetPosition();
      world.reset();
      break;
    case 37: // left arrow key
      mat4.rotate(tempMatrix, tempMatrix, -rotationStep, axisY);
      mat4.mul(rotationMatrix, tempMatrix, rotationMatrix);
      break;
    case 38: // up arrow key
      mat4.rotate(tempMatrix, tempMatrix, rotationStep, axisX);
      mat4.mul(rotationMatrix, tempMatrix, rotationMatrix);
      break;
    case 39: // right arrow key
      mat4.rotate(tempMatrix, tempMatrix, rotationStep, axisY);
      mat4.mul(rotationMatrix, tempMatrix, rotationMatrix);
      break;
    case 40: // down arrow key
      mat4.rotate(tempMatrix, tempMatrix, -rotationStep, axisX);
      mat4.mul(rotationMatrix, tempMatrix, rotationMatrix);
      break;
    case 87: // W
      vec3.add(translationVector, translationVector, translateY);
      break;
    case 65: // A,
      vec3.add(translationVector, translationVector, translateX);
      break;
    case 83: // S
      vec3.sub(translationVector, translationVector, translateY);
      break;
    case 68: // D
      vec3.sub(translationVector, translationVector, translateX);
      break;
    default:
      break;
  }
  validateTransform(world, false);
}

export function moveDown(world) {
  vec3.add(translationVector, translationVector, translateZ);
  validateTransform(world, true);
}

function validateTransform(world, isDown) {
  const objectOffset = world.space.objectOffset;
  const object = [];
  const blockIdx = world.object.getBlockIdx();
  var blockPosition;
  for (let i = 0; i < blockIdx.length; i++) {
    blockPosition = vec3.fromValues(
      blockIdx[i][0],
      blockIdx[i][1],
      blockIdx[i][2]
    );
    vec3.transformMat4(blockPosition, blockPosition, getUnvalidatedTransform());
    vec3.add(blockPosition, blockPosition, objectOffset);
    vec3.round(blockPosition, blockPosition);
    object.push(blockPosition);
  }
  if (isDown) {
    if (!world.space.tryMoveDown(object)) {
      if (mat4.equals(getTransform(), mat4.create())) {
        world.reset();
        return;
      }
      world.setRandomObject();
      world.initBuffers();
      resetPosition();
      return;
    }
  }
  const validated = world.space.objectCanMove(object);
  if (validated) {
    mat4.copy(validatedRotationMatrix, rotationMatrix);
    mat4.copy(validatedTranslationVector, translationVector);
  } else {
    mat4.copy(rotationMatrix, validatedRotationMatrix);
    mat4.copy(translationVector, validatedTranslationVector);
  }
}

function getUnvalidatedTransform() {
  mat4.translate(transformMatrix, mat4.create(), translationVector);
  mat4.mul(transformMatrix, transformMatrix, rotationMatrix);
  return transformMatrix;
}

export default function getTransform() {
  mat4.translate(
    validatedTransformMatrix,
    mat4.create(),
    validatedTranslationVector
  );
  mat4.mul(
    validatedTransformMatrix,
    validatedTransformMatrix,
    validatedRotationMatrix
  );
  return validatedTransformMatrix;
}
