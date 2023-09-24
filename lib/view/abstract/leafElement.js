"use strict"

import Area from "../common/area.js"
import figureFactory from "../common/figure.js"
import JsonPath from "../../common/jsonPath.js"
import DisplaySetting from "../../displayModel/setting/displaySetting.js"
import ColorNames from "../../common/colorNames.js"

class LeafElement extends Area {
  constructor(x, y, width, height, color, text, elementType) {
    super(x, y, width, height)
    this._color = color
    this._text = text
    this._elementType = elementType
  }
  /**
   * 
   * @param {DisplaySetting} setting 
   * @returns {Area[]}
   */
  figures(setting) {
    return [
      figureFactory.newColorBox(this.left, this.top, this.width, this.height, setting.colors.get(this._color)),
      figureFactory.newFrameBox(this.left, this.top, this.width, this.height, setting.colors.get(ColorNames.CELL_BORDER)),
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
