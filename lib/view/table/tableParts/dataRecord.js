"use strict";

import IndividualData from "./recordParts/individualData.js";
import NodeElement from "../../abstract/nodeElement.js"
import commonStyle from "../../common/commonStyle.js";

const indentSize = commonStyle.indentSize;

class DataRecord extends NodeElement {
  /**
   * 
   * @param {Object} data 
   * @param {Object} columns 
   */
  constructor(data, columns, x, y, width, height, depth) {
    super(x, y, width, height)
    const columnInfos = columns.getColumns().map(c => { return { name: c.name, left: c.left, width: c.width } })
    const rowIndentSize = indentSize * depth
    columnInfos[0].left += rowIndentSize
    columnInfos[0].width -= rowIndentSize
    // console.log(depth)
    // this._children = Object.fromEntries(
    //   columns.getColumns()
    //     .map(c => [c, data[c.name]])
    //     .map(([c, v]) => [c.name, new IndividualData(v, c.left, y, c.width, height)]))
    this._children = Object.fromEntries(
      columnInfos
        .map(c => [c, data[c.name]])
        .map(([c, v]) => [c.name, new IndividualData(v, c.left, y, c.width, height)]))
  }
}

export default DataRecord
