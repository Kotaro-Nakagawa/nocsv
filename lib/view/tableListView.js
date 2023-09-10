"use strict"

import TableView from "./tables/tableView.js"
import NodeElement from "./abstract/nodeElement.js"
import TableModel from "../model/tableModel.js"
import DisplaySetting from "../displayModel/setting/displaySetting.js"

const tableMargin = 20

class TableList extends NodeElement {
  /**
   * 
   * @param {TableModel[]} data 
   * @param {Object} { x: mainX, y: mainY }
   * @param {DisplaySetting} setting 
   */
  constructor(data, { x: mainX, y: mainY }, setting) {
    const mainWidth = setting.mainWidth
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
