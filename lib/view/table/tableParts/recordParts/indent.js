"use strict";

import LeafElement from "../../../abstract/leafElement";

class Indent extends LeafElement {
  constructor(x, y, width, height) {
    super(x, y, width, height, 'white', '')
  }
}

export default Indent
