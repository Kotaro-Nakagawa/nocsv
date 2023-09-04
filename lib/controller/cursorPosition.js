"use strict";

import ElementType from "../common/elementType.js"
import JsonPath from "../common/jsonPath.js";
import ModelManager from "../model/modelManager.js";

class CursorPosition {
  #model
  #currentTableIndex
  #currentRowIndex
  #currentColumnIndex
  /**
   * 
   * @param {ModelManager} model 
   */
  constructor(model) {
    this.#model = model
    this.reset()
  }

  /**
   * 
   * @returns {JsonPath} 現在の cursor 位置に対応した JsonPath
   */
  getPath() {
    if (this.#model.getRowType(new JsonPath([this.#currentRowIndex, this.#currentTableIndex])) === ElementType.SUB_TITLE) {
      return new JsonPath(['title', this.#currentRowIndex, this.#currentTableIndex])
    }
    return new JsonPath([this.#currentColumnIndex, this.#currentRowIndex, this.#currentTableIndex])
  }

  /**
   * 
   * @param {JsonPath} path 
   */
  setPath(path) {
    const pathLength = path._keys.length
    if (pathLength === 2) {
      this.#currentTableIndex = path._keys[1]
      this.#currentRowIndex = path._keys[0]
    } else {
      if (path._keys[0] === 'title' || path._keys[0] === 'isFolding') {
        this.#currentTableIndex = path._keys[2]
        this.#currentRowIndex = path._keys[1]
      } else {
        this.#currentTableIndex = path._keys[2]
        this.#currentRowIndex = path._keys[1]
        this.#currentColumnIndex = path._keys[0]
      }
    }
  }
  /**
   * cursor を初期位置に移動します
   */
  reset() {
    this.#currentTableIndex = 0
    this.#currentRowIndex = 0
    this.#currentColumnIndex = 0
  }

  #maxColumnIndex(tableIndex) {
    return this.#model.getColumns(new JsonPath([tableIndex])).length - 1
  }

  #extractIndicesOfRowsNotCollapsed(tableIndex) {
    const ret = []
    const targetTableRows = this.#model.getRowDepthsAndFoldings(tableIndex)
    let foldingDepth = undefined
    for (let i = 0; i < targetTableRows.length; i++) {
      const row = targetTableRows[i]
      if (foldingDepth === undefined) {
        ret.push(i)
        if (row.isFolding === true) {
          foldingDepth = row.depth
        }
      } else {
        if (row.depth > foldingDepth) {
          // Do Nothing
        } else {
          ret.push(i)
          foldingDepth = undefined
        }
      }
    }
    return ret
  }

  #belowOrBottomRowIndex() {
    const validRows = this.#extractIndicesOfRowsNotCollapsed(this.#currentTableIndex)
    const currentRowValue = parseInt(this.#currentRowIndex, 10)
    return validRows[Math.min(validRows.indexOf(currentRowValue) + 1, validRows.length - 1)]
  }

  #aboveOrTopRowIndex() {
    const validRows = this.#extractIndicesOfRowsNotCollapsed(this.#currentTableIndex)
    const currentRowValue = parseInt(this.#currentRowIndex, 10)
    return validRows[Math.max(validRows.indexOf(currentRowValue) - 1, 0)]
  }

  goUp() {
    this.#currentRowIndex = this.#aboveOrTopRowIndex(this.#currentRowIndex)
  }
  goDown() {
    this.#currentRowIndex = this.#belowOrBottomRowIndex(this.#currentRowIndex)
  }
  goLeft() {
    this.#currentColumnIndex = Math.max(this.#currentColumnIndex - 1, 0)
  }
  goRight() {
    this.#currentColumnIndex = Math.min(this.#currentColumnIndex + 1, this.#maxColumnIndex(this.#currentTableIndex))
  }

  #belowOrBottomTableIndex() {
    const tableCount = this.#model.getTableCount()
    const currentTableValue = parseInt(this.#currentTableIndex, 10)
    return Math.min(currentTableValue + 1, tableCount - 1)
  }

  #aboveOrTopTableIndex() {
    const currentTableValue = parseInt(this.#currentTableIndex, 10)
    return Math.max(currentTableValue - 1, 0)
  }

  goNextTable() {
    this.#currentTableIndex = this.#belowOrBottomTableIndex()
    this.#currentRowIndex = 0
  }
  goBeforeTable() {
    this.#currentTableIndex = this.#aboveOrTopTableIndex()
    this.#currentRowIndex = 0
  }

  get table() {
    return this.#currentTableIndex
  }
  get row() {
    return this.#currentRowIndex
  }
  get column() {
    return this.#currentColumnIndex
  }

}

export default CursorPosition
