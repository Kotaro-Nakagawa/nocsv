"use strict";

import IndividualData from "./cells/individualData.js";
import NodeElement from "../../abstract/nodeElement.js"
import commonStyle from "../../common/commonStyle.js";
import RecordModel from "../../../model/modelParts/recordModel.js";

const indentSize = commonStyle.indentSize;

class RecordView extends NodeElement {
  /**
   * 
   * @param {RecordModel} rowData 
   * @param {Object} columns 
   */
  constructor(rowData, columns, x, y, width, height) {
    super(x, y, width, height)
    const data = rowData.values
    const depth = rowData.depth
    const columnInfos = structuredClone(columns)
    const rowIndentSize = indentSize * depth
    columnInfos[0].left += rowIndentSize
    columnInfos[0].width -= rowIndentSize

    this._children = columnInfos.map((c, i) => new IndividualData(data[i], c.left, y, c.width, height))
  }
}

export default RecordView
