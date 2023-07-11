"use strict"

import ElementType from "../../common/elementType.js"
import JsonPath from "../../common/jsonPath.js"
import RowModel from "./rowModel.js"

class RecordModel extends RowModel {
  #values
  constructor(depth, data, columns) {
    super(ElementType.RECORD, depth)
    if (data === undefined) {
      this.#values = columns.map(c => '')
    } else {
      this.#values = columns.map(c => data[c])
    }
  }
  update(path, value) {
    this.#values[path.topKey] = value
  }
  get values() {
    return this.#values
  }
  /**
   * 
   * @param {JsonPath} path 
   * @returns {any} value
   */
  getValue(path) {
    return this.#values[path.topKey]
  }
  toJson(columns) {
    return Object.fromEntries(this.#values.map((v, i) => [columns[i], v]))
  }
}

export default RecordModel
