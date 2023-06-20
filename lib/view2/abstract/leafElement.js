"use strict"

import Area from "../common/area.js"
import figureFactory from "../common/figure.js"
import JsonPath from "../../common/jsonPath.js"

class LeafElement extends Area {
  constructor(x, y, width, height, color, text, elementType) {
    super(x, y, width, height)
    this._color = color
    this._text = text
    this._elementType = elementType
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
  elementTypeOfPath(path) {
    return this._elementType
  }
}

export default LeafElement
