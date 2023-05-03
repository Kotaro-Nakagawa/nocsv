"use strict"

import Area from "../common/area.js"
import figureFactory from "../common/figure.js"
import JsonPath from "../../common/jsonPath.js"

class LeafElement extends Area {
  constructor(x, y, width, height, color, text) {
    super(x, y, width, height)
    this._color = color
    this._text = text
  }
  figures() {
    return [
      figureFactory.newColorBox(this.left, this.top, this.width, this.height, this._color),
      figureFactory.newFrameBox(this.left, this.top, this.width, this.height, 'darkslategray'),
      figureFactory.newTextBox(this.left, this.top, this.width, this.height, this._text),
    ]
  }
  pathIfHit(x, y) {
    return this.isInside(x, y) ? new JsonPath() : undefined
  }
  areaOfPath(path) {
    return new Area(this.left, this.top, this.width, this.height)
  }
}

export default LeafElement
