"use strict"

import Area from "../common/area.js"

class NodeElement extends Area {
  constructor(x, y, width, height) {
    super(x, y, width, height)
    this._children = null // to be determined in concrete class
  }
  figures() {
    // return this._children.entries().flatMap(([key, value]) => value.figures())
    return Object.entries(this._children).flatMap(([key, value]) => value.figures())
  }
  pathIfHit(x, y) {
    if (!this.isInside(x, y)) return undefined
    // console.log(this)
    const buildJsonPath = (newKey, mayPath) => {
      if (!mayPath) return undefined;
      return mayPath.addParentKey(newKey)
    }
    return Object.entries(this._children)
      .map(([key, value]) => buildJsonPath(key, value.pathIfHit(x, y)))
      .find(e => e)
  }
  areaOfPath(path) {
    return this._children[path.topKey].areaOfPath(path.getFollwingPath())
  }
}

export default NodeElement
