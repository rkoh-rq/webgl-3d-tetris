const { mat4, vec3 } = require("gl-matrix");

const projectionMatrix = mat4.create();

function lookAt(cameraPosition, target, up) {
  var zAxis = vec3.create();
  var yAxis = vec3.create();
  var xAxis = vec3.create();
  vec3.normalize(zAxis, vec3.sub(zAxis, cameraPosition, target));
  vec3.normalize(xAxis, vec3.cross(xAxis, up, zAxis));
  vec3.normalize(yAxis, vec3.cross(yAxis, zAxis, xAxis));

  return mat4.fromValues(
    xAxis[0],
    xAxis[1],
    xAxis[2],
    0,
    yAxis[0],
    yAxis[1],
    yAxis[2],
    0,
    zAxis[0],
    zAxis[1],
    zAxis[2],
    0,
    cameraPosition[0],
    cameraPosition[1],
    cameraPosition[2],
    1
  );
}

const cameraPosition = vec3.fromValues(0, 0, -5);
const target = vec3.fromValues(0, 0, 0);
const up = vec3.fromValues(0, 1, 0);
const modelViewMatrix = lookAt(cameraPosition, target, up); // camera

const fieldOfView = (60 * Math.PI) / 180;
const zNear = 0.1;
const zFar = 100.0;

export function updatePerspectiveMatrix(aspect) {
  // Update the perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
}

export function clearDrawing(gl) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function drawObject(gl, programInfo, buffers, transformMatrix) {
  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.transformMatrix,
    false,
    transformMatrix
  );

  const type = gl.UNSIGNED_SHORT;
  const offset = 0;
  if (buffers.linesOnly) {
    gl.drawArrays(gl.LINES, offset, buffers.vertexCount);
  } else {
    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(gl.TRIANGLES, buffers.vertexCount, type, offset);
  }
}
