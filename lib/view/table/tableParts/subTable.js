"use strict";

import NodeElement from "../../abstract/nodeElement.js";
import SubTitle from "./subTitle.js";
import DataList from "./dataList.js";
import commonStyle from "../../common/commonStyle.js";
import FoldingButton from "./foldingButton.js";

const rowHeight = commonStyle.rowHeight
const indentSize = commonStyle.indentSize;

class SubTable extends NodeElement {
  constructor(data, columns, x, y, width, depth) {
    super(x, y, width)
    const title = data.title
    const datas = data.datas
    const isFolding = data.isFolding
    const rowIndentSize = indentSize * depth
    this._children = {
      title: new SubTitle(title, x + indentSize + rowIndentSize, y, width - indentSize - rowIndentSize, rowHeight),
      isFolding: new FoldingButton("", x + rowIndentSize, y, indentSize, rowHeight, isFolding)
    }
    this.setBottom(this._children.title.bottom)
    if (!isFolding) {
      this._children.datas = new DataList(datas, columns, x, this._children.title.bottom, width, depth + 1)
      this.setBottom(this._children.datas.bottom)
    }
  }
}

export default SubTable
