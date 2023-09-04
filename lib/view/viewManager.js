"use strict";

import TableList from "./tableListView.js";
import JsonPath from "../common/jsonPath.js";
import ModelManager from "../model/modelManager.js";
import ScrollManager from "../controller/scrollManager.js";

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
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {ScrollManager} scrollManager
   * @param {ModelManager} model 
   */
  constructor(canvas, scrollManager, model) {
    this.#canvas = canvas
    this.#ctx = canvas.getContext("2d")
    this.#scrollManager = scrollManager
    this.update(model.getData())
  }
  update(data) {
    const { width: w, height: h } = this.#canvas
    this.#ctx.clearRect(0, 0, w, h)
    this.#tableList = new TableList(data, this.#scrollManager.getBasePoint())
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