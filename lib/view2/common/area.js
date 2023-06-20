"use strict"

class ValueRange {
  constructor(min, max) {
    this._min = min
    this._max = max
  }
  get min() {
    return this._min
  }
  get max() {
    return this._max
  }
  get length() {
    return this._max - this._min
  }
  isInside(value) {
    return this._min <= value && value < this._max
  }
  // 子要素を生成する前に super() 呼び出しが必要な関係で、bottom のみ後から編集されうる
  setMax(value) {
    this._max = value
  }
}

class Area {
  constructor(left, top, width, height) {
    this._xRange = new ValueRange(left, left + width)
    this._yRange = new ValueRange(top, top + height)
  }
  get left() {
    return this._xRange.min
  }
  get top() {
    return this._yRange.min
  }
  get right() {
    return this._xRange.max
  }
  get bottom() {
    return this._yRange.max
  }
  get width() {
    return this._xRange.length
  }
  get height() {
    return this._yRange.length
  }
  isInside(x, y) {
    return this._xRange.isInside(x) && this._yRange.isInside(y)
  }
  // 子要素を生成する前に super() 呼び出しが必要な関係で、bottom のみ後から編集されうる
  setBottom(value) {
    this._yRange.setMax(value)
  }
}

export default Area
