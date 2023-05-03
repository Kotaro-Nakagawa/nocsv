"use strict";

import LeafElement from "../../abstract/leafElement.js";

class SubTitle extends LeafElement {
  constructor(titleStr, x, y, width, height) {
    super(x, y, width, height, 'white', titleStr)
  }
}

export default SubTitle
