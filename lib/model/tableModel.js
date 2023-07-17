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
   * path が示す行の下に record を追加します
   * @param {JsonPath} path 
   */
  insertNewRecord(path) {
    const baseRowIndex = path.topKey
    const currentRow = this._rows[baseRowIndex]
    const depthOfNewRecord = currentRow.type === ElementType.SUB_TITLE ? currentRow.depth + 1 : currentRow.depth
    const newRecord = new RecordModel(depthOfNewRecord, undefined, this.getColumns())
    this._rows.splice(baseRowIndex + 1, 0, newRecord)
  }
  /**
   * 
   * @param {JsonPath} path 
   */
  removeRecord(path) {
    const baseRowIndex = path.topKey
    if (this._rows[baseRowIndex].getType() === ElementType.RECORD) this._rows.splice(baseRowIndex, 1)
  }

  /**
   * path が示す行の下に subTitle を追加します
   * @param {JsonPath} path 
   */
  insertNewSubTitle(path) {
    const baseRowIndex = path.topKey
    const currentRow = this._rows[baseRowIndex]
    const depthOfNewRecord = currentRow.type === ElementType.SUB_TITLE ? currentRow.depth + 1 : currentRow.depth
    const newRecord = new SubTitleModel(depthOfNewRecord, 'new subtitle')
    this._rows.splice(baseRowIndex + 1, 0, newRecord)
  }
  /**
   * subTitle に対応する subTable が子要素を持たない場合に限りそれを削除します
   * @param {JsonPath} path 
   */
  removeSubTitle(path) {
    const baseRowIndex = path.topKey
    if (baseRowIndex === this._rows.length - 1) {
      this._rows.splice(baseRowIndex, 1)
    }
    const nextRowIndex = baseRowIndex + 1
    const baseRowDeoth = this._rows[baseRowIndex].depth
    const nextRowDepth = this._rows[nextRowIndex].depth
    if (baseRowDeoth >= nextRowDepth) {
      this._rows.splice(baseRowIndex, 1)
    }
  }
  /**
   * 
   * @param {JsonPath} path 
   */
  getValue(path) {
    return this._rows[path.topKey].getValue(path.getFollwingPath())
  }
  /**
   * 
   * @param {JsonPath} path 
   * @returns {ElementType} ElementType
   */
  getRowType(path) {
    return this._rows[path.topKey].getType(path.getFollwingPath())
  }

  /**
   * 
   * @param {JsonPath} path 
   * @returns {Number} depth
   */
  getDepth(path) {
    return this._rows[path.topKey].getDepth(path.getFollwingPath())
  }

  /**
   * 
   * @param {Number} rowNo row index
   * @returns {Boolean}
   */
  #isRelativeMaxDepth(rowNo) {
    const previousRow = this._rows[rowNo - 1]
    const targetRow = this._rows[rowNo]
    if (targetRow.depth === previousRow.depth + ((previousRow.type === ElementType.SUB_TITLE) ? 1 : 0)) {
      return true
    }
    return false
  }

  /**
   * 
   * @param {Number} rowNo 
   * @returns {Boolean} 
   */
  #canDeepen(rowNo) {
    if (rowNo === TableModel.TITLE_ROW_INDEX) return false
    if (rowNo === TableModel.HEADER_ROW_INDEX) return false
    return !this.#isRelativeMaxDepth(rowNo)
  }
  /**
   * 対象の行を可能であれば 1 段階深くします。不可能であれば何もしません
   * @param {JsonPath} path 
   */
  deepenRow(path) {
    const rowNo = path.topKey
    if (this.#canDeepen(rowNo)) {
      this._rows[rowNo].deepen()
    }
  }
  /**
   * 
   * @param {Number} rowNo 
   * @returns {Boolean} 
   */
  #canShallow(rowNo) {
    if (rowNo === TableModel.TITLE_ROW_INDEX) return false
    if (rowNo === TableModel.HEADER_ROW_INDEX) return false
    if (rowNo === this._rows.length - 1) return true
    return !this.#isRelativeMaxDepth(rowNo + 1)
  }
  /**
   * 対象の行を、可能であれば 1 段階浅くします。不可能であれば何もしません
   * @param {JsonPath} path 
   */
  shallowRow(path) {
    const rowNo = path.topKey
    if (this.#canShallow(rowNo)) {
      this._rows[rowNo].shallow()
    }
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
