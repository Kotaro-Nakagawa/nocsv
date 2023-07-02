"use strict";

import TableList from "./tableListView.js";
import JsonPath from "../common/jsonPath.js";
import ModelManager from "../model/modelManager.js";

class ViewManager {
  /**
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {ModelManager} model 
   */
  constructor(canvas, model) {
    this._canvas = canvas
    this._ctx = canvas.getContext("2d")
    this.update(model.getData())
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
  getAreaOfPath(path) {
    const view = this._tableList
    return view.areaOfPath(path)
  }
}

export default ViewManager