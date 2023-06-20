"use strict";

import TableList from "./tableListView.js";
import JsonPath from "../common/jsonPath.js";

class ViewManager {
  constructor(canvas) {
    this._canvas = canvas
    this._ctx = canvas.getContext("2d")
  }
  update(data) {
    const { width: w, height: h } = this._canvas
    this._ctx.clearRect(0, 0, w, h)
    this._tableList = new TableList(data)
    this._tableList.figures().forEach(e => e.renderMe(this._ctx))
  }
  getAreaAndPathIfCollided(x, y) {
    const view = this._tableList
    if (!view) return undefined
    const path = view.pathIfHit(x, y)
    if (!path) return undefined
    const area = view.areaOfPath(path)
    const elementType = view.elementTypeOfPath(path)
    return {
      path, area, elementType
    }
  }
  getInitialCursorPosition() {
    const areaPath = this.getAreaAndPathIfCollided(24, 8)
    console.log(areaPath)
    return areaPath.area
  }
}

export default ViewManager