"use strict"

import TableView from "./tables/tableView.js"
import NodeElement from "./abstract/nodeElement.js"
import TableModel from "../model/tableModel.js"

const mainWidth = 800
const tableMargin = 20

class TableList extends NodeElement {
  /**
   * 
   * @param {TableModel[]} data 
   */
  constructor(data, { x: mainX, y: mainY }) {
    super(mainX, mainY, mainWidth, 0)
    this._children = []
    let tmpY = mainY
    for (const d of data) {
      const newTable = new TableView(d, mainX, tmpY, mainWidth)
      this._children.push(newTable)
      tmpY = newTable.bottom + tableMargin
    }
    this.setBottom(this._children.at(-1).bottom)
  }
}

export default TableList
