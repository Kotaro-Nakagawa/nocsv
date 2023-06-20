"use strict";

import ElementType from "../../../../common/elementType";
import LeafElement from "../../../abstract/leafElement";

class Indent extends LeafElement {
  constructor(x, y, width, height) {
    super(x, y, width, height, 'white', '', ElementType.INDENT)
  }
}

export default Indent
