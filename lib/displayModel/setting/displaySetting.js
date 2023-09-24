"use strict";

class DisplaySetting {
  /**
   * @type {Number}
   */
  #mainWidth

  /**
   * @type {Map<String, String>}
   */
  #colors

  constructor(mainWidth, colors) {
    this.#mainWidth = mainWidth
    this.#colors = colors
  }

  get mainWidth() {
    return this.#mainWidth
  }

  get colors() {
    return this.#colors
  }
}

export default DisplaySetting
