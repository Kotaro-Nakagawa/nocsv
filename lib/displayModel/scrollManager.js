"use strict"

const mainX = 24
const mainY = 8

class ScrollManager {
  #scrollX
  #scrollY
  #scrollUnit = 32

  /**
   * @type {Number}
   */
  #areaBottom = 0

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
    if (scrollvalue === 0) {
      return false
    }
    this.#scrollY += scrollvalue
    return true
  }
  /**
   * @param {Number} value
   */
  scrollDown(value) {
    const scrollValue = value || Math.min(this.#scrollUnit, Math.abs(Math.max(this.#areaBottom, 0)))
    if (scrollValue === 0) {
      return false
    }
    this.#scrollY -= scrollValue
    return true
  }
  /**
   * 
   * @returns {{x: Number, y: Number}}
   */
  getBasePoint() {
    return {
      x: this.#scrollX,
      y: this.#scrollY
    }
  }

  /**
   * @param {Number} value 
   */
  setAreaBottom(value) {
    this.#areaBottom = value
  }
}

export default ScrollManager
