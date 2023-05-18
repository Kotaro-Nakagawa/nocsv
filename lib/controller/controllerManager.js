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
    this.inputWindow = undefined
  }

  onClick(e) {
    e.preventDefault()
    if (this.inputWindow) {
      this.inputWindow.deactivate()
    }
    const { top, left } = e.target.getBoundingClientRect();
    const pathAndArea = this.view.getAreaAndPathIfCollided(e.clientX - left, e.clientY - top)
    if (!pathAndArea) return
    const { path, area, elementType } = pathAndArea

    if (elementType === ElementType.FOLDING_BUTTON) {
      this.model.update(path, !(this.model.getValue(path)))
      this.view.update(this.model.getData())
      return
    }

    this.inputWindow = new InputWindow(this.canvas)

    const onUpdateDelegate = (value) => {
      this.model.update(path, value)
      this.view.update(this.model.getData())
    }

    this.inputWindow.activate(this.model.getValue(path), area, (v) => { onUpdateDelegate(v) })
  }
}

export default ControllerManager
