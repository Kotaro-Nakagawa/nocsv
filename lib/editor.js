"use strict"

import ModelManager from "./model/modelManager.js"
import ViewManager from "./view/viewManager.js"
import ControllerManager from "./controller/controllerManager.js"
import ScrollManager from "./controller/scrollManager.js"


console.log('load succeed')

const editorElementSetting = (editor) => {
  editor.setAttribute("display", "inline-block");
  editor.style.setProperty("background-color", "darkslategray")
  editor.style.height = "600px"
  editor.style.position = 'relative';
  const canvas = document.createElement('canvas')
  canvas.height = `${editor.clientHeight}`
  canvas.width = `${editor.clientWidth}`
  canvas.style.height = `${editor.clientHeight}px`
  canvas.style.width = `${editor.clientWidth}px`
  editor.appendChild(canvas)
  return canvas
}


class Editor {
  #element
  #canvas
  #scrollManager
  #view
  #model
  #controller
  constructor(edirotElement) {
    this.#element = edirotElement
    this.#canvas = editorElementSetting(edirotElement)
    this.#scrollManager = new ScrollManager()
    this.#model = new ModelManager()
    this.#view = new ViewManager(this.#canvas, this.#scrollManager, this.#model)
    this.#controller = new ControllerManager(this.#canvas, this.#scrollManager, this.#view, this.#model)
    this.#resetView()
  }

  #resetView() {
    this.#view.update(this.#model.getData())
    this.#controller.resetCursor()
  }
  /**
   * 
   * @returns {JSON} json 化したデータ
   */
  export() {
    return this.#model.toJson()
  }
  /**
   * 
   * @param {JSON} json 
   */
  import(json) {
    this.#model.import(json)
    this.#resetView(json)
  }
}

export default Editor
