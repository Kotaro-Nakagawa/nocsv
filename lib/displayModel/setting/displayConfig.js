"use strict";

import ColorNames from "../../common/colorNames.js";
import DisplaySetting from "./displaySetting.js";

class DisplayConfig {
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

  constructor() {
    // デフォルト値を設定
    this.#mainWidth = 800
    this.#mainX = 24
    this.#mainY = 8
    this.#colors = new Map([
      [ColorNames.TITLE_BASE, 'green'],
      [ColorNames.HEADER_BASE, 'cyan'],
      [ColorNames.CELL_BASE, 'white'],
      [ColorNames.FOLDING_BUTTON_BASE, 'white'],
      [ColorNames.CELL_BORDER, 'darkslategray'],
      [ColorNames.SUBTITLE_BASE, 'white']
    ])
  }

  /**
   * @param {Number} value 
   */
  set mainWidth(value) {
    this.#mainWidth = value
  }

  /**
   * @returns {Number}
   */
  get mainX() {
    return this.#mainX
  }

  /**
   * @param {Number} value 
   */
  set mainX(value) {
    this.#mainX = value
  }

  /**
   * @returns {Number}
   */
  get mainY() {
    return this.#mainY
  }

  /**
   * @param {Number} value 
   */
  set mainY(value) {
    this.#mainY = value
  }


  /**
   * @param {string} color 
   */
  set titleColor(color) {
    if (CSS.supports('color', color)) this.#colors.set(ColorNames.TITLE_BASE, color)
  }

  /**
   * @param {string} color 
   */
  set headerColor(color) {
    if (CSS.supports('color', color)) this.#colors.set(ColorNames.HEADER_BASE, color)
  }

  /**
   * @param {string} color 
   */
  set cellColor(color) {
    if (CSS.supports('color', color)) this.#colors.set(ColorNames.CELL_BASE, color)
  }

  /**
   * @param {string} color 
   */
  set subTitleColor(color) {
    if (CSS.supports('color', color)) this.#colors.set(ColorNames.SUBTITLE_BASE, color)
  }

  /**
   * @param {string} color 
   */
  set cellBorderColor(color) {
    if (CSS.supports('color', color)) this.#colors.set(ColorNames.CELL_BORDER, color)
  }

  /**
   * 
   * @returns {DisplaySetting} setting
   */
  getSetting() {
    return new DisplaySetting(
      this.#mainWidth,
      this.#mainX,
      this.#mainY,
      this.#colors
    )
  }
}

export default DisplayConfig
