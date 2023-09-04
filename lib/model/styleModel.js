"use strict";

class StyleModel {
  #columnsWeight
  constructor(json) {
    const valuesToParse = json || {}
    this.#columnsWeight = valuesToParse.columnsWeight || {}
  }
  get columnsWeight() {
    return this.#columnsWeight
  }
  /**
   * 
   * @param {string[]} columns 
   * @returns {Number[]}
   */
  getColumnsWeightList(columns) {
    return columns.map(c => this.#columnsWeight[c] || 1)
  }

  toJson(columns) {
    return {
      columnsWeight: Object.keys(this.#columnsWeight).length === 0 ? undefined : this.#columnsWeight
    }
  }
}

export default StyleModel
