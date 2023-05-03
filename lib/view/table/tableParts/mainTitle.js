"use strict";

import LeafElement from "../../abstract/leafElement.js";

class MainTitle extends LeafElement {
  constructor(titleStr, x, y, width, height) {
    super(x, y, width, height, 'green', titleStr)
  }
}

export default MainTitle
