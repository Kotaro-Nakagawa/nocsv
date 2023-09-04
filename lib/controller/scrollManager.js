"use strict"

const mainX = 24
const mainY = 8
const mainWidth = 800

class ScrollManager {
  #scrollX
  #scrollY
  #scrollUnit = 32
  constructor() {
    this.#scrollX = 0
    this.#scrollY = 0
  }
  /**
   * @param {Number} value
   */
  set scrollUnit(value) {
    this.#scrollUnit = value
  }
  /**
   * @param {Number} value
   */
  scrollUp(value) {
    const scrollvalue = value || Math.min(this.#scrollUnit, Math.abs(this.#scrollY))
    this.#scrollY += scrollvalue
  }
  /**
   * @param {Number} value
   */
  scrollDown(value) {
    const scrollValue = value || this.#scrollUnit
    this.#scrollY -= scrollValue
  }
  /**
   * 
   * @returns {{x: Number, y: Number}}
   */
  getBasePoint() {
    return {
      x: this.#scrollX + mainX,
      y: this.#scrollY + mainY
    }
  }
}

export default ScrollManager
