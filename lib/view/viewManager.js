"use strict";

import TableList from "./tableListView.js";
import JsonPath from "../common/jsonPath.js";
import ModelManager from "../model/modelManager.js";
import DisplayModelManager from "../displayModel/displayModelManager.js";

class ViewManager {
  /**
   * @type {HTMLCanvasElement}
   */
  #canvas



  /**
   * @type {CanvasRenderingContext2D}
   */
  #ctx

  /**
   * @type {TableList}
   */
  #tableList

  /**
   * @type {DisplayModelManager}
   */
  #displayModel

  /**
   * 
   * @param {ModelManager} model 
   * @param {DisplayModelManager} displayModel 
   */
  constructor(model, displayModel) {
    this.#canvas = displayModel.canvas
    this.#ctx = this.#canvas.getContext("2d")
    this.#displayModel = displayModel
    this.update(model.getData())
  }
  update(data) {
    const { width: w, height: h } = this.#canvas
    this.#ctx.clearRect(0, 0, w, h)
    this.#tableList = new TableList(data, this.#displayModel.scrollManager.getBasePoint(), this.#displayModel.setting)
    this.#tableList.figures().forEach(e => e.renderMe(this.#ctx))
  }
  getAreaAndPathIfCollided(x, y) {
    const view = this.#tableList
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
    const view = this.#tableList
    return view.areaOfPath(path)
  }

}

export default ViewManager