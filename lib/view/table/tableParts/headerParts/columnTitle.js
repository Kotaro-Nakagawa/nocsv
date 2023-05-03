"use strict";

import LeafElement from "../../../abstract/leafElement.js";

class ColumnTitle extends LeafElement {
  constructor(data, x, y, width, height) {
    super(x, y, width, height, 'cyan', data.name)
    this._name = data
    this._text = data
  }
  get name() {
    return this._name
  }
  get type() {
    return this._type
  }
  setName(name) {
    this._name = name
  }
  setType(type) {
    this._type = type
  }
  toJson() {
    return {
      name: this._name,
      type: this._type
    }
  }
}

export default ColumnTitle
