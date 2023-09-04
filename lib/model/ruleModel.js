"use strict";

import DataValidation from "./ruleParts/dataValidation.js";

class RuleModel {
  #json
  constructor(json, columns) {
    const rules = json || {}
    this.#json = columns.map(c => rules[c])
  }

  /**
   * 
   * @param {string} column 
   * @returns {DataValidation} バリデーション
   */
  getValidation(column) {
    if (!this.#json[column]) return undefined
    return new DataValidation(this.#json[column].validation)
  }

  toJson(columns) {
    return Object.fromEntries(this.#json.map((v, i) => [columns[i], v]))
  }
}

export default RuleModel
