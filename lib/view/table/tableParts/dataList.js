"use strict"

import NodeElement from "../../abstract/nodeElement.js"
import commonStyle from "../../common/commonStyle.js";
import DataRecord from "./dataRecord.js"
import SubTable from "./subTable.js"
const rowHeight = commonStyle.rowHeight;

const makeSubData = (data, columns, x, y, width, depth) => {
  // switch して default で exception を投げるべき
  if (Array.isArray(data.datas)) {
    return new SubTable(data, columns, x, y, width, depth)
  }
  return new DataRecord(data, columns, x, y, width, rowHeight, depth)
}

const makeSubDatas = (datas, columns, x, y, width, depth) => {
  const subData = makeSubData(datas.shift(), columns, x, y, width, depth)
  if (datas.length === 0) {
    return [subData]
  }
  return [subData, ...makeSubDatas(datas, columns, x, subData.bottom, width, depth)]
}

class DataList extends NodeElement {
  constructor(datas, columns, x, y, width, depth) {
    super(x, y, width, 0)
    this._children = makeSubDatas(datas, columns, x, y, width, depth)
    this.setBottom(this._children[this._children.length - 1].bottom)
  }
}

export default DataList
