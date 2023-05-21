"use strict"

import ElementType from "../common/elementType.js"
import InputWindow from "./inputWindow.js"

class ControllerManager {
  constructor(canvas, view, model) {
    this.canvas = canvas
    this.view = view
    this.model = model
    // const inputWindow = new InputWindow(canvas)
    this.inputMode = false
    this.inputWindow = undefined // データをロードするまで Cursor の初期位置が定まらないため
  }

  makeCursor() {
    this.inputWindow = new InputWindow(this.canvas, this.view.getInitialCursorPosition())
    console.log("make cursor succeed")
  }

  onClick(e) {
    // e.preventDefault()
    // const { top, left } = e.target.getBoundingClientRect();
    const { top, left } = this.canvas.getBoundingClientRect();
    const pathAndArea = this.view.getAreaAndPathIfCollided(e.clientX - left, e.clientY - top)
    if (!pathAndArea) return
    // console.log(e)

    // https://stackoverflow.com/questions/5497073/how-to-differentiate-single-click-event-and-double-click-event
    if (e.detail === 1) {
      // it was a single click
      this.onSingleClick(pathAndArea)
    } else if (e.detail === 2) {
      // it was a double click
      this.onDoubleClick(pathAndArea)
    }
  }

  onSingleClick(pathAndArea) {
    console.log('clicked')
    if (this.inputWindow.isActive) {
      return
    }
    const { path, area, elementType } = pathAndArea
    if (elementType === ElementType.FOLDING_BUTTON) {
      this.model.update(path, !(this.model.getValue(path)))
      this.view.update(this.model.getData())
      return
    }
    console.log(area)
    this.inputWindow.moveTo(area)
  }

  onDoubleClick(pathAndArea) {
    console.log('double clicked')
    if (this.inputWindow) {
      this.inputWindow.deactivate()
    }
    const { path, area, elementType } = pathAndArea

    if (elementType === ElementType.FOLDING_BUTTON) {
      return
    }

    const onUpdateDelegate = (value) => {
      this.model.update(path, value)
      this.view.update(this.model.getData())
    }

    this.inputWindow.activateAt(this.model.getValue(path), area, (v) => { onUpdateDelegate(v) })
  }
}

export default ControllerManager
