"use strict";

import ElementType from "../../common/elementType.js"
import JsonPath from "../../common/jsonPath.js";
import ModelManager from "../../model/modelManager.js";
import CursorPosition from "../cursorPosition.js";

class ModelController {
  /**
   * @type {ModelManager}
   */
  #model
  /**
   * 
   * @param {ModelManager} model 
   */
  constructor(model) {
    this.#model = model
  }

  /**
   * 
   * @param {Number[]} keys 
   * @returns {Number[]}
   */
  #pathKeyOfPreviousRow = (keys) => {
    const ret = structuredClone(keys)
    ret[keys.length - 2] -= 1
    return ret
  }

  /**
   * @param {JsonPath} path
   * @returns {Boolean}
   */
  #onRelativeMaxDepth(path) {
    const currentPath = new JsonPath(path._keys)
    const targetRowType = this.#model.getRowType(currentPath)
    if (targetRowType === ElementType.MAIN_TITLE || targetRowType === ElementType.COLUMN_TITLE) return
    const targetRowDepth = this.#model.getDepth(currentPath)
    const previousRowPath = new JsonPath(this.#pathKeyOfPreviousRow(path._keys))
    const previousRowType = this.#model.getRowType(previousRowPath)
    const previousRowDepth = this.#model.getDepth(previousRowPath)
    if (targetRowDepth === previousRowDepth + ((previousRowType === ElementType.SUB_TITLE) ? 1 : 0)) {
      return true
    }
    return false
  }

  /**
   * 
   * @param {CursorPosition} position 
   * @returns {Boolean} true: Row を深くした、false: subTable を追加した
   */
  deepenRowOrInsertSubTable(position) {
    console.log(position)
    const path = position.getPath()
    const addSubTable = this.#onRelativeMaxDepth(path)
    if (addSubTable) {
      this.#model.insertNewSubTitle(new JsonPath(this.#pathKeyOfPreviousRow(path._keys)))
      return false
    }
    this.#model.deepenRow(path)
    return true
  }

  /**
   * Path が示す行が SubTitle であることを前提として、その行の isFolding を示す path を返却します
   * @param {JsonPath} path 
   * @returns {JsonPath}
   */
  #getIsFoldingPath(path) {
    const newKeys = path._keys
    newKeys[0] = 'isFolding'
    return new JsonPath(newKeys)
  }

  /**
   * 
   * @param {CursorPosition} position 
   * @returns {Boolean} true: 折りたたんだ、false: subTitle では無かった
   */
  foldSubTableIfSubTableTitle(position) {
    const path = position.getPath()
    if (this.#model.getRowType(path) === ElementType.SUB_TITLE) {
      this.#model.update(this.#getIsFoldingPath(path), true)
      return true
    }
    return false
  }

  /**
   * 
   * @param {CursorPosition} position 
   * @returns {Boolean} true: 開いた、false: subTitle では無かった
   */
  openSubTableIfSubTableTitle(position) {
    const path = position.getPath()
    if (this.#model.getRowType(path) === ElementType.SUB_TITLE) {
      this.#model.update(this.#getIsFoldingPath(path), false)
      return true
    }
    return false
  }

  /**
   * 
   * @param {JsonPath} path 
   */
  toggleSubTableFoldStatus(path) {
    this.#model.update(path, !(this.#model.getValue(path)))
  }

  /**
   * 
   * @param {JsonPath} path
   */
  insertNewRecord(path) {
    this.#model.insertNewRecord(path)
  }

  #newRowsRange(from, upto) {
    return {
      from,
      upto
    }
  }

  #newJsonPath(tableId, rowId, columnId) {
    return new JsonPath([columnId, rowId, tableId])
  }

  #shallowTargetRows(tableId, rowRange) {
    // 処理中にデータの状態が不整合になることを防ぐため、下から shallow していく
    for (let i = rowRange.upto - 1; i >= rowRange.from; i--) {
      this.#model.shallowRow(this.#newJsonPath(tableId, i, undefined))
    }
  }

  /**
   * 
   * @param {JsonPath} path 
   * @returns 範囲を示す object {from, upto} from は inclusive, upto は exclusive
   */
  #getChildrenRangeOfSubTable(path) {
    if (this.#model.getRowType(path) !== ElementType.SUB_TITLE) return this.#newRowsRange(0, 0)
    const [columnId, rowId, tableId] = path.keyArray
    const table = this.#model._tableList[tableId]
    const baseDepth = table._rows[rowId].depth
    const roopStartId = parseInt(rowId, 10) + 1
    for (let i = roopStartId; i < table._rows.length; i++) {
      if (table._rows[i].depth <= baseDepth) {
        return this.#newRowsRange(roopStartId, i)
      }
    }
    return this.#newRowsRange(rowId, table._rows.length)
  }

  /**
   * @param {JsonPath} path
   * @returns {Boolean} true: 消した、false: 消してない
   */
  deleteRow(path) {
    if (this.#model.getRowType(path) === ElementType.SUB_TITLE) {
      const [columnId, rowId, tableId] = path.keyArray
      this.#shallowTargetRows(tableId, this.#getChildrenRangeOfSubTable(path))
      this.#model.removeSubTitle(path)
    } else {
      this.#model.removeRecord(path)
    }
    return false
  }

  /**
   * 
   * @param {JsonPath} path 
   */
  clearCell(path) {
    this.#model.update(path, "")
  }
}

export default ModelController
