"use strict"

import ElementType from "../../common/elementType.js"
import RowModel from "./rowModel.js"

class SubTitleModel extends RowModel {
  constructor(depth, title) {
    super(ElementType.SUB_TITLE, depth)
    this._title = title
    this._isFolding = false
  }
  get title() {
    return this._title
  }
  get isFolding() {
    return this._isFolding
  }
  update(path, value) {
    const target = path.topKey
    if (target === 'isFolding') {
      this._isFolding = value
    } else {
      this._title = value
    }
  }
  getValue(path) {
    const target = path.topKey
    if (target === 'isFolding') {
      return this._isFolding
    } else {
      return this._title
    }
  }
}

export default SubTitleModel
