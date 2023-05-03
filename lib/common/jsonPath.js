"use strict";

class JsonPath {
  constructor(keys) {
    this._keys = keys ?? []
  }
  addParentKey(parent) {
    if (!parent) return null
    this._keys.push(parent)
    return this
  }
  pop() {
    return this._keys.pop()
  }
  peek() {
    if (this.keyLength === 0) return undefined
    return this._keys[this.keyLength - 1]
  }
  get keyLength() {
    return this._keys.length
  }
  get keyArray() {
    return structuredClone(this._keys)
  }
  get topKey() {
    return this._keys[this.keyLength - 1]
  }
  get lastKey() {
    return this._keys[0]
  }
  getFollwingPath() {
    return new JsonPath(this._keys.slice(0, -1))
  }
  isLastKey() {
    return this._keys.length === 1
  }
}

export default JsonPath
