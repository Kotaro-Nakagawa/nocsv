"use strict"

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

const editBox = () => {
  const elem = document.createElement('div')
  elem.style.position = 'absolute';
  elem.style.display = 'block'
  elem.style.borderStyle = 'solid'
  elem.style.borderWidth = `${cursorBorderWidth}px`
  elem.style.borderColor = 'black'
  return elem
}

class InputWindow {
  constructor(canvas, rect) {
    this._canvas = canvas
    this._element = editBox()
    this.moveTo(rect)
    this._canvas.parentElement.appendChild(this._element)
    this._element.onclick = (e) => { console.log(`input window clicked ${e.detail}`) }
    this._isActive = false
  }
  get isActive() {
    return this._isActive
  }
  activate(currentValue, update) {
    this.deactivate()
    this._isActive = true
    this._update = update
    this._element.innerText = currentValue
    this._element.contentEditable = true
    this._element.style.backgroundColor = 'white'
    setCaret(this._element)
  }
  moveTo(rect) {
    this._element.style.top = `${rect.top - cursorBorderWidth}px`
    this._element.style.left = `${rect.left - cursorBorderWidth}px`
    this._element.style.height = `${rect.height}px`
    this._element.style.width = `${rect.width}px`
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
    this._update(this._element.innerText)
  }
  deactivate() {
    this._element.innerText = ""
    this._element.contentEditable = false
    this._element.style.backgroundColor = 'transparent'
    this._isActive = false
  }
}

export default InputWindow
