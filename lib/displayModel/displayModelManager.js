"use strict"

import DisplayConfig from "./setting/displayConfig.js"
import DisplaySetting from "./setting/displaySetting.js"
import ScrollManager from "./scrollManager.js"

class DisplayModelManager {
  /**
   * @type {DisplayConfig}
   */
  #config

  /**
   * @type {Function}
   */
  #onSettingChange

  /**
   * @type {ScrollManager}
   */
  #scrollManager

  /**
   * @type {HTMLCanvasElement}
   */
  #canvas

  /**
   * 
   * @param {Function} onSettingChange 
   * @param {HTMLCanvasElement} canvas 
   */
  constructor(onSettingChange, canvas) {
    this.#config = new DisplayConfig()
    this.#onSettingChange = onSettingChange
    this.#scrollManager = new ScrollManager()
    this.#canvas = canvas
  }

  /**
   * 
   * @param {Number} value 
   */
  setMainWidth(value) {
    this.#config.mainWidth = value
    if (this.#onSettingChange) {
      this.#onSettingChange()
    }
  }


  /**
   * 
   * @param {String} color 
   */
  setTitleColor(color) {
    this.#config.titleColor = color
    if (this.#onSettingChange) {
      this.#onSettingChange()
    }
  }
  /**
   * 
   * @param {String} color 
   */
  setHeaderColor(color) {
    this.#config.headerColor = color
    if (this.#onSettingChange) {
      this.#onSettingChange()
    }
  }

  /**
   * 
   * @param {String} color 
   */
  setCellColor(color) {
    this.#config.cellColor = color
    if (this.#onSettingChange) {
      this.#onSettingChange()
    }
  }

  /**
   * 
   * @param {String} color 
   */
  setSubTitleColor(color) {
    this.#config.subTitleColor = color
    if (this.#onSettingChange) {
      this.#onSettingChange()
    }
  }

  /**
   * 
   * @param {String} color 
   */
  setCellBorderColor(color) {
    this.#config.cellBorderColor = color
    if (this.#onSettingChange) {
      this.#onSettingChange()
    }
  }

  /**
   * 
   * @returns {DisplaySetting}
   */
  get setting() {
    return this.#config.getSetting()
  }

  get canvas() {
    return this.#canvas
  }

  get scrollManager() {
    return this.#scrollManager
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

  resetCanvas() {
    const editor = this.#canvas.parentElement
    this.#canvas.height = `${editor.clientHeight}`
    this.#canvas.width = `${editor.clientWidth}`
    this.#canvas.style.height = `${editor.clientHeight}px`
    this.#canvas.style.width = `${editor.clientWidth}px`
    this.clearCanvas()
  }

  clearCanvas() {
    const ctx = this.#canvas.getContext("2d")
    const { width: w, height: h } = this.#canvas
    ctx.clearRect(0, 0, w, h)
  }

  getContext2d() {
    return this.#canvas.getContext("2d")
  }
}

export default DisplayModelManager
