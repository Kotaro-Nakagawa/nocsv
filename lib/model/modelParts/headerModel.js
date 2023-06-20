"use strict"

import ElementType from "../../common/elementType.js"
import RowModel from "./rowModel.js"

class HeaderModel extends RowModel {
  constructor(columns) {
    super(ElementType.COLUMN_TITLE, 0)
    this._columns = columns
  }
  toJson() {
    return this._columns
  }
}

export default HeaderModel
