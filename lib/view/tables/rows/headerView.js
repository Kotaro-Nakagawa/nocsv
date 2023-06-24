"use strict"

import ColumnTitle from "./cells/columnTitle.js"
import NodeElement from "../../abstract/nodeElement.js"
import commonStyle from "../../common/commonStyle.js"

const indentSize = commonStyle.indentSize

class HeaderView extends NodeElement {
  constructor(columns, x, y, width, height) {
    super(x, y, width, height)
    this._children = columns.map(c => new ColumnTitle(c.name, c.left, y, c.width, height))
  }
}

export default HeaderView
