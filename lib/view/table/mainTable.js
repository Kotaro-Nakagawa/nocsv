"use strict";

import Headers from "./tableParts/header.js";
import NodeElement from "../abstract/nodeElement.js";
import MainTitle from "./tableParts/mainTitle.js";
import DataList from "./tableParts/dataList.js";
import commonStyle from "../common/commonStyle.js";

const rowHeight = commonStyle.rowHeight

// keys みたいなのを用意しておく？
const headerKey = 'header'

const calcMaxDepth = (data, currentDepth) => {
  if (Array.isArray(data.datas)) {
    return Math.max(...data.datas.map(d => calcMaxDepth(d, currentDepth + 1)))
  }
  return currentDepth
}

class MainTable extends NodeElement {
  constructor(data, x, y, width) {
    super(x, y, width)
    this._children = {}
    this._children.title = new MainTitle(data.title, x, y, width, rowHeight)
    this._children.columns = new Headers(data.columns, x, this._children.title.bottom, width, rowHeight, calcMaxDepth(data, -1))
    this._children.datas = new DataList(data.datas, this._children.columns, x, this._children.columns.bottom, width, 0)
    this.setBottom(this._children.datas.bottom)
  }
}

export default MainTable
