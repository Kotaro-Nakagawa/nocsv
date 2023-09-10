"use strict";

class DisplaySetting {
  /**
   * @type {Number}
   */
  #mainWidth


  constructor(mainWidth) {
    this.#mainWidth = mainWidth
  }

  get mainWidth() {
    return this.#mainWidth
  }
}

export default DisplaySetting
