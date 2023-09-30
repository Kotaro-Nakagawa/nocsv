"use strict";

import TableList from "./tableListView.js";
import JsonPath from "../common/jsonPath.js";
import ModelManager from "../model/modelManager.js";
import DisplayModelManager from "../displayModel/displayModelManager.js";
import Area from "./common/area.js";

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
    this.#displayModel.clearCanvas()
    this.#tableList = new TableList(data, this.#displayModel.scrollManager.getBasePoint(), this.#displayModel.setting)
    this.#tableList.figures(this.#displayModel.setting).forEach(e => e.renderMe(this.#displayModel.getContext2d()))
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

  /**
   * @param {JsonPath} path 
   * @returns {Area} path で指定された要素の Area
   */
  getAreaOfPath(path) {
    const view = this.#tableList
    return view.areaOfPath(path)
  }
}

export default ViewManager