"use strict";

import ColorNames from "../../../../common/colorNames.js";
import ElementType from "../../../../common/elementType.js";
import LeafElement from "../../../abstract/leafElement.js";

class IndividualData extends LeafElement {
  constructor(data, x, y, width, height) {
    super(x, y, width, height, ColorNames.CELL_BASE, data, ElementType.CELL)
  }
  get data() {
    return this._text
  }
  set data(value) {
    this._text = value
  }
}

export default IndividualData
