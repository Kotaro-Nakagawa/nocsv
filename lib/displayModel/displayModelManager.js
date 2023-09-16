"use strict"

import DisplayConfig from "./setting/displayConfig.js"
import DisplaySetting from "./setting/displaySetting.js"

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
}

export default DisplayModelManager
