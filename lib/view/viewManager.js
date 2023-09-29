"use strict";

import TableList from "./tableListView.js";
import JsonPath from "../common/jsonPath.js";
import ModelManager from "../model/modelManager.js";
import DisplayModelManager from "../displayModel/displayModelManager.js";

class ViewManager {
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
    this.#displayModel = displayModel
    this.update(model.getData())
  }
  update(data) {
    const canvas = this.#displayModel.canvas
    const ctx = canvas.getContext("2d")
    const { width: w, height: h } = canvas
    ctx.clearRect(0, 0, w, h)
    this.#tableList = new TableList(data, this.#displayModel.scrollManager.getBasePoint(), this.#displayModel.setting)
    this.#tableList.figures(this.#displayModel.setting).forEach(e => e.renderMe(ctx))
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