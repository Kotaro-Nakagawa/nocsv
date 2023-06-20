"use strict";

const counter = (function () {
  let innerCounter = 0
  return {
    count: () => {
      innerCounter++
      return innerCounter
    }
  }
})()

const cell = counter.count()
const foldingButton = counter.count()
const subTitle = counter.count()
const mainTitle = counter.count()
const indentElement = counter.count()
const columnTitle = counter.count()
const record = counter.count()

class ElementType {
  static get CELL() {
    return cell
  }
  static get FOLDING_BUTTON() {
    return foldingButton
  }
  static get SUB_TITLE() {
    return subTitle
  }
  static get MAIN_TITLE() {
    return mainTitle
  }
  static get COLUMN_TITLE() {
    return columnTitle
  }
  static get INDENT() {
    return indentElement
  }
  static get RECORD() {
    return record
  }
}

export default ElementType
