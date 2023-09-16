"use strict";

import TableList from "./tableListView.js";
import JsonPath from "../common/jsonPath.js";
import ModelManager from "../model/modelManager.js";
import ScrollManager from "../controller/scrollManager.js";
import DisplayModelManager from "../displayModel/displayModelManager.js";

class ViewManager {
  /**
   * @type {HTMLCanvasElement}
   */
  #canvas

  /**
   * @type {ScrollManager}
   */
  #scrollManager

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
   * @param {ScrollManager} scrollManager
   * @param {ModelManager} model 
   * @param {DisplayModelManager} displayModel 
   */
  constructor(scrollManager, model, displayModel) {
    this.#canvas = displayModel.canvas
    this.#ctx = this.#canvas.getContext("2d")
    this.#scrollManager = scrollManager
    this.#displayModel = displayModel
    this.update(model.getData())
  }
  update(data) {
    const { width: w, height: h } = this.#canvas
    this.#ctx.clearRect(0, 0, w, h)
    this.#tableList = new TableList(data, this.#scrollManager.getBasePoint(), this.#displayModel.setting)
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
  /**
   * @param {Number} value
   */
  scrollUp(value) {
    this.#scrollManager.scrollUp(value)
  }
  /**
   * @param {Number} value
   */
  scrollDown(value) {
    this.#scrollManager.scrollDown(value)
  }
}

export default ViewManager