"use strict";

import ElementType from "../../../../common/elementType.js";
import LeafElement from "../../../abstract/leafElement.js";

class SubTitle extends LeafElement {
  constructor(titleStr, x, y, width, height) {
    super(x, y, width, height, 'white', titleStr, ElementType.SUB_TITLE)
  }
}

export default SubTitle
