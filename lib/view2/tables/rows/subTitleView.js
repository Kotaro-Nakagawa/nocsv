"use strict";

import SubTitleModel from "../../../model/modelParts/subTitleModel.js";
import NodeElement from "../../abstract/nodeElement.js";
import SubTitle from "./cells/subTitle.js";
import commonStyle from "../../common/commonStyle.js";
import FoldingButton from "./cells/foldingButton.js";

const indentSize = commonStyle.indentSize;

class SubTitleView extends NodeElement {
  /**
   * 
   * @param {SubTitleModel} title 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} width 
   * @param {Number} height 
   */
  constructor(title, x, y, width, height) {
    super(x, y, width, height)
    const rowIndentSize = indentSize * title.depth
    this._children = {
      title: new SubTitle(title.title, x + indentSize + rowIndentSize, y, width - indentSize - rowIndentSize, height),
      isFolding: new FoldingButton("", x + rowIndentSize, y, indentSize, height, title.isFolding)
    }
  }
}

export default SubTitleView
