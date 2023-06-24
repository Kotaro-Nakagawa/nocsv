"use strict"

import ElementType from "../../common/elementType.js"
import RowModel from "./rowModel.js"

class TitleModel extends RowModel {
  constructor(title) {
    super(ElementType.MAIN_TITLE, 0)
    this._title = title
  }
  get title() {
    return this._title
  }
  getValue() {
    return this._title
  }
}

export default TitleModel
