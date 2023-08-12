"use strict"

import Area from "../view/common/area.js"

/**
 * 
 * @param {HTMLElement} el editable な div
 */
function setCaret(el) {
  var range = document.createRange()
  var sel = window.getSelection()

  range.setStart(el.childNodes[0], 0)
  range.setEnd(el.childNodes[0], el.innerText.length)

  sel.removeAllRanges()
  sel.addRange(range)
}

const cursorBorderWidth = 4
const elementId = 'inputWindow'

/**
 * 
 * @returns {HTMLDivElement} 生成した div element
 */
const editBox = () => {
  const elem = document.createElement('div')
  elem.style.position = 'absolute';
  elem.style.display = 'block'
  elem.style.borderStyle = 'solid'
  elem.style.borderWidth = `${cursorBorderWidth}px`
  elem.style.borderColor = 'black'
  elem.id = elementId
  return elem
}

class InputWindow {
  /**
   * @type {HTMLDivElement}
   */
  #element

  /**
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {Area} rect 
   */
  constructor(canvas, rect) {
    this._canvas = canvas
    this.#element = editBox()
    this.moveTo(rect)
    this._canvas.parentElement.appendChild(this.#element)
    this.#element.onclick = (e) => { console.log(`input window clicked ${e.detail}`) }
    this._isActive = false
  }
  get isActive() {
    return this._isActive
  }
  activate(currentValue, update) {
    this.deactivate()
    this._isActive = true
    this._update = update
    this.#element.innerText = currentValue
    this.#element.contentEditable = true
    this.#element.style.backgroundColor = 'white'
    this.#element.focus()
    if (this.#element.childNodes.length > 0) setCaret(this.#element)
  }
  moveTo(rect) {
    this.#element.style.top = `${rect.top - cursorBorderWidth}px`
    this.#element.style.left = `${rect.left - cursorBorderWidth}px`
    this.#element.style.height = `${rect.height}px`
    this.#element.style.width = `${rect.width}px`
  }
  activateAt(currentValue, rect, update) {
    this.activate(currentValue, update)
    this.moveTo(rect)
  }
  onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault()
      this.update()
      this.deactivate()
    }
  }
  update() {
    this._update(this.#element.innerText)
  }
  deactivate() {
    this.#element.innerText = ""
    this.#element.contentEditable = false
    this.#element.style.backgroundColor = 'transparent'
    this._isActive = false
  }
  focus() {
    this.#element.focus()
  }
  /**
   * 固定値 'inputWindow'
   */
  get elementId() {
    return elementId
  }
}

export default InputWindow
