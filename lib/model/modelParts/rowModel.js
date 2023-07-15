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
  deepen() {
    this._depth += 1
  }
  shallow() {
    if (this._depth === 0) return
    this._depth -= 1
  }
}

export default RowModel
