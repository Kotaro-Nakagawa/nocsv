"use strict"

class RowModel {
  constructor(type, depth) {
    this._type = type
    this._depth = depth
  }
  get type() {
    return this._type
  }
  get depth() {
    return this._depth
  }
  getType() {
    return this._type
  }
}

export default RowModel
