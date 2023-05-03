"use strict"

import ColumnTitle from "./headerParts/columnTitle.js"
import NodeElement from "../../abstract/nodeElement.js"
import commonStyle from "../../common/commonStyle.js"

const indentSize = commonStyle.indentSize

class Headers extends NodeElement {
  constructor(columns, x, y, width, height, maxDepth) {
    super(x, y, width, height)
    const serial = Array.from({ length: columns.length }, (v, i) => i)
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
    this._children = serial.map(i => new ColumnTitle(columns[i], columnXs[i], y, columnWidths[i], height))
  }
  getColumns() {
    return this._children
  }
}

export default Headers
