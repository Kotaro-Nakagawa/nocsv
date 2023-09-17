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
}

export default DisplayModelManager
