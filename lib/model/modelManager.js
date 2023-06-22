"use strict"

import JsonPath from "../common/jsonPath.js"
import TableModel from "./tableModel.js"

const getListFromJson = (json) => {
  return Object.entries(json).map(([k, v]) => new TableModel(k, v))
}

class ModelManager {
  constructor(json) {
    this._tableList = getListFromJson(json)
  }
  toJson() {
    return Object.fromEntries(this._tableList.map(t => t.toJson()))
  }
  update(path, value) {
    console.log(path, value)
    return this._tableList[path.topKey].update(path.getFollwingPath(), value)
  }
  /**
   * 
   * @param {JsonPath} path 
   */
  getValue(path) {
    return this._tableList[path.topKey].getValue(path.getFollwingPath())
  }
  getData() {
    return this._tableList
  }
}

export default ModelManager