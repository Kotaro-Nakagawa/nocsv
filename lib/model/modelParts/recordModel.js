"use strict"

import ElementType from "../../common/elementType.js"
import JsonPath from "../../common/jsonPath.js"
import RowModel from "./rowModel.js"

class RecordModel extends RowModel {
  constructor(depth, data, columns) {
    super(ElementType.RECORD, depth)
    this._values = columns.map(c => data[c])
  }
  update(path, value) {
    this._values[path.topKey] = value
  }
  /**
   * 
   * @param {JsonPath} path 
   * @returns {any} value
   */
  getValue(path) {
    return this._values[path.topKey]
  }
  toJson(columns) {
    return Object.fromEntries(this._values.map((v, i) => [columns[i], v]))
  }
}

export default RecordModel
