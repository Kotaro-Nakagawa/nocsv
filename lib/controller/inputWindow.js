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
  // range.collapse(true)

  sel.removeAllRanges()
  sel.addRange(range)
}

const editBox = (rect) => {
  const elem = document.createElement('div')
  elem.style.position = 'absolute';
  elem.style.display = 'block'
  elem.style.top = `${rect.top}px`
  elem.style.left = `${rect.left}px`
  elem.style.height = `${rect.height}px`
  elem.style.width = `${rect.width}px`
  elem.contentEditable = true
  return elem
}

class InputWindow {
  constructor(canvas) {
    this._canvas = canvas
  }
  activate(currentValue, rect, update) {
    this.deactivate()
    this._update = update
    this._element = editBox(rect)
    this._canvas.parentElement.appendChild(this._element)
    this._element.addEventListener('keydown', e => { this.onKeyDown(e) })
    this._element.innerText = currentValue
    this._element.style.backgroundColor = 'white'
    this._element.id = 'a'
    // this._element.focus()
    setCaret(this._element)
  }
  onKeyDown(e) {
    if (e.key === "Enter") {
      console.log("find Enter")
      e.preventDefault()
      this.update()
      this.deactivate()
    }
  }
  update() {
    this._update(this._element.innerText)
  }
  deactivate() {
    if (this._element) {
      this._element.remove()
    }
  }
}

export default InputWindow
