"use strict"

import ElementType from "../common/elementType.js"
import InputWindow from "./inputWindow.js"

class ControllerManager {
  constructor(canvas, view, model) {
    this._canvas = canvas
    this.view = view
    this.model = model
    this.inputMode = false
    this.inputWindow = undefined // データをロードするまで Cursor の初期位置が定まらないため
    this._canvas.parentElement.onclick = (e) => {
      e.preventDefault()
      this.onClick(e)
    }
  }

  get canvas() {
    return this._canvas
  }

  makeCursor() {
    this.inputWindow = new InputWindow(this.canvas, this.view.getInitialCursorPosition())
  }

  #getViewPathAndAreaFromEvent = (e) => {
    const { top, left } = this.canvas.getBoundingClientRect();
    return this.view.getAreaAndPathIfCollided(e.clientX - left, e.clientY - top)
  }

  onClick(e) {
    if (this.inputWindow.isActive) {
      return
    }
    const pathAndArea = this.#getViewPathAndAreaFromEvent(e)
    if (!pathAndArea) return
    const { path, area, elementType } = pathAndArea

    if (elementType === ElementType.FOLDING_BUTTON) {
      this.model.update(path, !(this.model.getValue(path)))
      this.view.update(this.model.getData())
      return
    }

    if (e.detail === 1) {
      this.onSingleClick(area)
    } else if (e.detail === 2) {
      this.onDoubleClick(path, area)
    }
  }

  onSingleClick(area) {
    this.inputWindow.moveTo(area)
  }

  onDoubleClick(path, area) {
    const onUpdateDelegate = (value) => {
      this.model.update(path, value)
      this.view.update(this.model.getData())
    }

    this.inputWindow.activateAt(this.model.getValue(path), area, (v) => { onUpdateDelegate(v) })
  }
}

export default ControllerManager
