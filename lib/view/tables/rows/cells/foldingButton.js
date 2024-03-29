"use strict";

import ColorNames from "../../../../common/colorNames.js";
import ElementType from "../../../../common/elementType.js";
import LeafElement from "../../../abstract/leafElement.js";
import figureFactory from "../../../common/figure.js";

class FoldingButton extends LeafElement {
  constructor(data, x, y, width, height, folding) {
    super(x, y, width, height, ColorNames.FOLDING_BUTTON_BASE, data, ElementType.FOLDING_BUTTON)
    this._folding = folding
  }
  // オーバーライド
  figures() {
    return [
      figureFactory.newFoldingButtonBox(this.left, this.top, this.width, this.height, this._color, this._folding)
    ]
  }
}

export default FoldingButton
