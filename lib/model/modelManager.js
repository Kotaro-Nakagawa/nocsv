"use strict"

import JsonPath from "../common/jsonPath.js"
import TableModel from "./tableModel.js"

const getListFromJson = (json) => {
  return Object.entries(json).map(([k, v]) => new TableModel(k, v))
}


const defaultJson = {
  mainTable: {
    columns: ["column"],
    datas: [],
    rules: []
  }
}

class ModelManager {
  constructor() {
    this._tableList = getListFromJson(defaultJson)
  }
  import(json) {
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
  insertNewRecord(path) {
    this._tableList[path.topKey].insertNewRecord(path.getFollwingPath())
  }
  /**
   * 
   * @param {JsonPath} path 
   */
  getValue(path) {
    return this._tableList[path.topKey].getValue(path.getFollwingPath())
  }
  /**
   * 
   * @param {JsonPath} path 
   */
  getType(path) {
    return this._tableList[path.topKey].getType(path.getFollwingPath())
  }
  getData() {
    return this._tableList
  }
  getColumns(path) {
    return this._tableList[path.topKey].getColumns()
  }
}

export default ModelManager
