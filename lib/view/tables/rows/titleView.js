"use strict";

import ColorNames from "../../../common/colorNames.js";
import TitleModel from "../../../model/modelParts/titleModel.js";
import LeafElement from "../../abstract/leafElement.js";

class TitleView extends LeafElement {
  /**
   * 
   * @param {TitleModel} title 
   * @param {Number} x 
   * @param {Number} y 
   * @param {Number} width 
   * @param {Number} height 
   */
  constructor(title, x, y, width, height) {
    super(x, y, width, height, ColorNames.TITLE_BASE, title.title)
  }
}

export default TitleView
