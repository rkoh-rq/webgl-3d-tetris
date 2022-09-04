import "./styles.css";
import initShaderProgram from "./gl/shader.js";
import {
  updatePerspectiveMatrix,
  drawObject,
  clearDrawing
} from "./gl/draw.js";
import getTransform, {
  checkKeyDown,
  moveDown,
  getOffsetTransform
} from "./key_press";

import World from "./world";

const { mat4 } = require("gl-matrix");

function main() {
  const canvas = document.querySelector("#glcanvas");
  const gl = canvas.getContext("webgl");

  // If we don't have a GL context, give up now

  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl);

  // Pass the aspect ratio to the draw program
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  updatePerspectiveMatrix(aspect);

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor")
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      transformMatrix: gl.getUniformLocation(shaderProgram, "uTransformMatrix")
    }
  };

  // Create the scene objects
  const world = new World(gl, { x: 4, y: 4, z: 10 });
  const offsetTransform = getOffsetTransform(world.spaceSize);
  const spaceTransform = world.space.getCentralizeTransform();
  const spaceObjectsTransform = world.space.getCentralizeObjectsTransform();

  // Draw the scene
  let then = 0;

  window.addEventListener("keydown", (e) => checkKeyDown(e, world));

  // Draw the scene repeatedly
  var totalTime = 0;

  function render(now) {
    now *= 0.001; // convert to seconds
    var deltaTime = now - then;
    then = now;
    totalTime += deltaTime;

    if (totalTime > 1) {
      totalTime = 0;
      moveDown(world);
    }

    var transformMatrix = getTransform();
    mat4.mul(transformMatrix, offsetTransform, transformMatrix);

    clearDrawing(gl, programInfo);
    drawObject(gl, programInfo, world.spaceBuffers, spaceTransform);
    drawObject(gl, programInfo, world.objectBuffers, transformMatrix);
    drawObject(
      gl,
      programInfo,
      world.spaceFilledBuffers,
      spaceObjectsTransform
    );
    drawObject(gl, programInfo, world.spaceLineBuffers, spaceObjectsTransform);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
