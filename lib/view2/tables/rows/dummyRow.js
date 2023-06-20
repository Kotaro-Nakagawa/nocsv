"use strict"

import LeafElement from "../../abstract/leafElement.js";

class DummyRow extends LeafElement {
  constructor(x, y, width) {
    super(x, y, width, 0, undefined, undefined, undefined)
  }
}

export default DummyRow
