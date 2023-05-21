"use strict"

import ElementType from "../common/elementType.js"
import InputWindow from "./inputWindow.js"

class ControllerManager {
  constructor(canvas, view, model) {
    this.canvas = canvas
    this.view = view
    this.model = model
    this.inputMode = false
    this.inputWindow = undefined // データをロードするまで Cursor の初期位置が定まらないため
  }

  makeCursor() {
    this.inputWindow = new InputWindow(this.canvas, this.view.getInitialCursorPosition())
  }

  onClick(e) {
    e.preventDefault()
    if (this.inputWindow.isActive) {
      return
    }
    const { top, left } = this.canvas.getBoundingClientRect();
    const pathAndArea = this.view.getAreaAndPathIfCollided(e.clientX - left, e.clientY - top)
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
      this.onDoubleClick(pathAndArea)
    }
  }

  onSingleClick(area) {
    this.inputWindow.moveTo(area)
  }

  onDoubleClick(pathAndArea) {
    const { path, area, elementType } = pathAndArea

    const onUpdateDelegate = (value) => {
      this.model.update(path, value)
      this.view.update(this.model.getData())
    }

    this.inputWindow.activateAt(this.model.getValue(path), area, (v) => { onUpdateDelegate(v) })
  }
}

export default ControllerManager
