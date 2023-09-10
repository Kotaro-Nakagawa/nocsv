"use strict";

import DisplaySetting from "./displaySetting.js";

class DisplayConfig {
  /**
   * @type {Number}
   */
  #mainWidth

  constructor() {
    // デフォルト値を設定
    this.#mainWidth = 800
  }

  /**
   * @param {Number} value 
   */
  set mainWidth(value) {
    this.#mainWidth = value
  }

  getSetting() {
    return new DisplaySetting(
      this.#mainWidth
    )
  }
}

export default DisplayConfig
