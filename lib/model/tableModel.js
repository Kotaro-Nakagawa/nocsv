"use strict"

import ElementType from "../common/elementType.js"
import FormatKeywords from "../common/formatKeywords.js"
import JsonPath from "../common/jsonPath.js"
import HeaderModel from "./modelParts/headerModel.js"
import RecordModel from "./modelParts/recordModel.js"
import RowModel from "./modelParts/rowModel.js"
import SubTitleModel from "./modelParts/subTitleModel.js"
import TitleModel from "./modelParts/titleModel.js"

const isSubtable = (v) => {
  const [k0, v0] = Object.entries(v)[0]
  return Array.isArray(v0)
}

const getRowListFromJson = (title, json) => {
  const ret = []
  const columns = json[FormatKeywords.COLUMNS]
  const addDatas = (list, depth) => {
    for (const unit of list) {
      if (isSubtable(unit)) {
        const [title, datas] = Object.entries(unit)[0]
        ret.push(new SubTitleModel(depth, title))
        addDatas(datas, depth + 1)
      } else {
        ret.push(new RecordModel(depth, unit, columns))
      }
    }
  }
  ret.push(new TitleModel(title))
  ret.push(new HeaderModel(columns))
  addDatas(json[FormatKeywords.DATAS], 0)
  return ret
}

/**
 * 
 * @param {RowModel[]} list
 * @param {Array} columns
 */
const getJsonFromRowList = (list, columns) => {
  let currentIndex = 2 // 0 は title 行、1 は Header 行
  const listSize = list.length
  const jsonOfDeeperSet = (depth) => {
    const ret = []
    while (currentIndex < listSize && list[currentIndex].depth >= depth) {
      const row = list[currentIndex]
      currentIndex += 1
      if (row.type === ElementType.SUB_TITLE) {
        ret.push({
          [row.title]: jsonOfDeeperSet(depth + 1)
        })
      } else {
        ret.push(row.toJson(columns))
      }
    }
    return ret
  }
  return jsonOfDeeperSet(0)
}

class TableModel {
  constructor(title, json) {
    this._rows = getRowListFromJson(title, json)
  }
  static get TITLE_ROW_INDEX() {
    return 0
  }
  static get HEADER_ROW_INDEX() {
    return 1
  }
  static get RECORD_START_INDEX() {
    return 2
  }
  /**
   * @returns {TitleModel}
   */
  get titleRow() {
    return this._rows[TableModel.TITLE_ROW_INDEX]
  }
  /**
   * @returns {HeaderModel}
   */
  get headerRow() {
    return this._rows[TableModel.HEADER_ROW_INDEX]
  }
  update(path, value) {
    return this._rows[path.topKey].update(path.getFollwingPath(), value)
  }
  /**
   * 
   * @param {JsonPath} path 
   */
  getValue(path) {
    return this._rows[path.topKey].getValue(path.getFollwingPath())
  }
  getColumns() {
    return this.headerRow._columns
  }
  toJson() {
    const columns = this.headerRow.toJson()
    return [this.titleRow.title, {
      [FormatKeywords.COLUMNS]: columns,
      [FormatKeywords.DATAS]: getJsonFromRowList(this._rows, columns),
      [FormatKeywords.RULES]: []
    }]
  }
}

export default TableModel
