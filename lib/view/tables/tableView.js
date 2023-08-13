"use strict"

import ElementType from "../../common/elementType.js"
import TableModel from "../../model/tableModel.js"
import NodeElement from "../abstract/nodeElement.js"
import DummyRow from "./rows/dummyrow.js"
import HeaderView from "./rows/headerView.js"
import RecordView from "./rows/recordView.js"
import SubTitleView from "./rows/subTitleView.js"
import TitleView from "./rows/titleView.js"
import commonStyle from "../common/commonStyle.js"

const rowHeight = commonStyle.rowHeight
const indentSize = commonStyle.indentSize;

const columnInfoSet = (columns, x, width, maxDepth) => {
  const columnWeights = columns.map(c => 1)
  const columnTotalWeight = columnWeights.reduce((a, c) => a + c);
  const indexMargin = indentSize * maxDepth
  const usableWidth = width - indexMargin
  const weightToWidth = (w) => {
    return w * usableWidth / columnTotalWeight
  }
  const columnWidths = columnWeights.map(w => weightToWidth(w))
  columnWidths[0] += indexMargin
  const columnXs = [x]
  for (let i = 0; i < columns.length; i++) {
    columnXs.push(columnXs[i] + columnWidths[i])
  }
  return Array.from({ length: columns.length }, (v, i) => i).map(i => { return { name: columns[i], left: columnXs[i], width: columnWidths[i] } })
}


class TableView extends NodeElement {
  /**
   * 
   * @param {TableModel} table 
   */
  constructor(table, x, y, width) {
    super(x, y, width, 0)
    this._children = []
    let foldingDepth = undefined
    const columnsInfo = columnInfoSet(table.getColumns(), x, width, Math.max(...table._rows.map(r => r.depth)))
    let currentY = y;
    this._children.push(new TitleView(table._rows[0], x, currentY, width, rowHeight))
    currentY += rowHeight
    this._children.push(new HeaderView(columnsInfo, x, currentY, width, rowHeight))
    currentY += rowHeight
    for (let i = 2; i < table._rows.length; i++) {
      const row = table._rows[i]
      if (foldingDepth === undefined) {
        switch (row.type) {
          case ElementType.SUB_TITLE:
            this._children.push(new SubTitleView(row, x, currentY, width, rowHeight))
            break
          default:
            this._children.push(new RecordView(row, columnsInfo, x, currentY, width, rowHeight, row.depth))
        }
      } else {
        if (row.depth > foldingDepth) {
          this._children.push(new DummyRow(x, currentY, width))
        } else {
          foldingDepth = undefined
          switch (row.type) {
            case ElementType.SUB_TITLE:
              this._children.push(new SubTitleView(row, x, currentY, width, rowHeight))
              break
            default:
              this._children.push(new RecordView(row, columnsInfo, x, currentY, width, rowHeight, row.depth))
          }
        }
      }
      if (row.isFolding === true) {
        foldingDepth = row.depth
      }
      currentY = this._children[i].bottom
    }
    this.setBottom(this._children.at(-1).bottom)
  }
}

export default TableView
