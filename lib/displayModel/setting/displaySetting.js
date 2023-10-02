"use strict";

class DisplaySetting {
  /**
   * @type {Number}
   */
  #mainWidth

  /**
   * @type {Number}
   */
  #mainX

  /**
   * @type {Number}
   */
  #mainY

  /**
   * @type {Map<String, String>}
   */
  #colors

  constructor(mainWidth, mainX, mainY, colors) {
    this.#mainWidth = mainWidth
    this.#mainX = mainX
    this.#mainY = mainY
    this.#colors = colors
  }

  get mainWidth() {
    return this.#mainWidth
  }

  get mainX() {
    return this.#mainX
  }

  get mainY() {
    return this.#mainY
  }

  get colors() {
    return this.#colors
  }
}

export default DisplaySetting
