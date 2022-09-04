import Space from "./objects/space";

import initObjectBuffers, { initSpaceBuffers } from "./gl/buffers.js";
import jBlock from "./objects/tetris_blocks/jblock";
import iBlock from "./objects/tetris_blocks/iblock";
import sBlock from "./objects/tetris_blocks/sblock";
import tBlock from "./objects/tetris_blocks/tblock";
import oBlock from "./objects/tetris_blocks/oblock";

export default class World {
  constructor(gl, spaceSize) {
    this.spaceSize = spaceSize;
    this.space = new Space(spaceSize);
    this.gl = gl;

    // Create the scene objects
    const s_block = new sBlock([1, 1, 1, 1]);
    const t_block = new tBlock([1, 1, 1, 1]);
    const o_block = new oBlock([1, 1, 1, 1]);
    const j_block = new jBlock([1, 1, 1, 1]);
    const i_block = new iBlock([1, 1, 1, 1]);
    this.possibleObjects = [s_block, t_block, o_block, j_block, i_block];
    this.setRandomObject();

    // Initialize buffers
    this.initBuffers();
  }
  startTimeout() {
    this.timeout = window.setTimeout(this.startTimeout, 3000);
  }
  reset() {
    this.space = new Space(this.spaceSize);
    this.setRandomObject();
    this.initBuffers();
  }
  setRandomObject() {
    this.object = this.possibleObjects[
      Math.floor(Math.random() * this.possibleObjects.length)
    ];
  }
  initBuffers() {
    this.objectBuffers = initObjectBuffers(this.gl, this.object);
    this.spaceBuffers = initSpaceBuffers(this.gl, this.space);
    this.spaceLineBuffers = initObjectBuffers(this.gl, this.space.lineSpace);
    this.spaceFilledBuffers = initObjectBuffers(
      this.gl,
      this.space.filledSpace
    );
  }
}
