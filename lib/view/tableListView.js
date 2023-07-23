"use strict"

import TableView from "./tables/tableView.js"
import NodeElement from "./abstract/nodeElement.js"
import TableModel from "../model/tableModel.js"

const mainWidth = 800

class TableList extends NodeElement {
  /**
   * 
   * @param {TableModel[]} data 
   */
  constructor(data, { x: mainX, y: mainY }) {
    super(mainX, mainY, mainWidth, 0)
    this._children = data.map(d => new TableView(d, mainX, mainY, mainWidth))
    this.setBottom(this._children[this._children.length - 1].bottom)
  }
}

export default TableList
