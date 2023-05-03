"use strict";

import LeafElement from "../../../abstract/leafElement.js";

class IndividualData extends LeafElement {
  constructor(data, x, y, width, height) {
    super(x, y, width, height, 'white', data)
  }
  get data() {
    return this._text
  }
  set data(value) {
    this._text = value
  }
}

export default IndividualData
