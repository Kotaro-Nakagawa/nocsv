"use strict"

import MainTable from "./table/mainTable.js"
import NodeElement from "./abstract/nodeElement.js"

const mainX = 24
const mainY = 8
const mainWidth = 800

class TableList extends NodeElement {
  constructor(data) {
    super(mainX, mainY, mainWidth, 0)
    this._children = data.tableList.map(d => new MainTable(d, mainX, mainY, mainWidth))
    this.setBottom(this._children[this._children.length - 1].bottom)
  }
}

export default TableList
