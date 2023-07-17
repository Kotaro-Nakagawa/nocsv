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
  /**
   * 
   * @param {JsonPath} path 値を変更する要素
   * @param {String} value 変更先の値
   * @returns 
   */
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
  removeRecord(path) {
    this._tableList[path.topKey].removeRecord(path.getFollwingPath())
  }
  /**
   * 
   * @param {JsonPath} path 
   */
  insertNewSubTitle(path) {
    this._tableList[path.topKey].insertNewSubTitle(path.getFollwingPath())
  }
  /**
   * 
   * @param {JsonPath} path 
   */
  removeSubTitle(path) {
    this._tableList[path.topKey].removeSubTitle(path.getFollwingPath())
  }
  /**
   * 
   * @param {JsonPath} path  
   */
  deepenRow(path) {
    this._tableList[path.topKey].deepenRow(path.getFollwingPath())
  }
  /**
   * 
   * @param {JsonPath} path  
   */
  shallowRow(path) {
    this._tableList[path.topKey].shallowRow(path.getFollwingPath())
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
  getRowType(path) {
    return this._tableList[path.topKey].getRowType(path.getFollwingPath())
  }
  /**
   * 
   * @param {JsonPath} path 
   */
  getDepth(path) {
    return this._tableList[path.topKey].getDepth(path.getFollwingPath())
  }
  getData() {
    return this._tableList
  }
  getColumns(path) {
    return this._tableList[path.topKey].getColumns()
  }
}

export default ModelManager
