"use strict"

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
    const { path, area } = pathAndArea

    // クリックされたのが cell か button かを判断して処理を条件分岐するする
    // view 側が button に何て key を割り当ててるかを知ってるのが気持ち悪いかもしれないが、リファクタリングは後回し
    // そもそも view も model が title って名前だから title って名前で title view 作ってる所あるよね

    if (path.lastKey === 'isFolding') {
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
