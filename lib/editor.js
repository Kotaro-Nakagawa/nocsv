"use strict"

import ModelManager from "./model/modelManager.js"
import ViewManager from "./view/viewManager.js"
import ControllerManager from "./controller/controllerManager.js"
import ScrollManager from "./controller/scrollManager.js"
import DisplayModelManager from "./displayModel/displayModelManager.js"


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
  /**
   * @type {HTMLDivElement}
   */
  #element

  /**
   * @type {HTMLCanvasElement}
   */
  #canvas

  /**
   * @type {ScrollManager}
   */
  #scrollManager

  /**
   * @type {ViewManager}
   */
  #view

  /**
   * @type {ModelManager}
   */
  #model

  /**
   * @type {ControllerManager}
   */
  #controller

  /**
   * @type {DisplayModelManager}
   */
  #display
  constructor(editorElement) {
    this.#element = editorElement
    this.#canvas = editorElementSetting(editorElement)
    this.#scrollManager = new ScrollManager()
    this.#model = new ModelManager()
    this.#display = new DisplayModelManager(() => { this.#displayReload() })
    this.#view = new ViewManager(this.#canvas, this.#scrollManager, this.#model, this.#display)
    this.#controller = new ControllerManager(this.#canvas, this.#view, this.#model)
    this.#resetView()
  }

  #resetView() {
    this.#view.update(this.#model.getData())
    this.#controller.resetCursor()
  }

  #displayReload() {
    this.#controller.updateDisplay()
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

  get displayConfig() {
    return this.#display
  }
}

export default Editor
