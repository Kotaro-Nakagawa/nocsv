"use strict"

import TableView from "./tables/tableView.js"
import NodeElement from "./abstract/nodeElement.js"
import TableModel from "../model/tableModel.js"

const mainX = 24
const mainY = 8
const mainWidth = 800

class TableList extends NodeElement {
  /**
   * 
   * @param {TableModel[]} data 
   */
  constructor(data) {
    super(mainX, mainY, mainWidth, 0)
    this._children = data.map(d => new TableView(d, mainX, mainY, mainWidth))
    this.setBottom(this._children[this._children.length - 1].bottom)
  }
}

export default TableList
