"use strict"

import ElementType from "../common/elementType.js"
import JsonPath from "../common/jsonPath.js"
import ModelManager from "../model/modelManager.js"
import ViewManager from "../view/viewManager.js"
import CursorPosition from "./cursorPosition.js"
import InputWindow from "./inputWindow.js"

class ControllerManager {
  #canvas
  #view
  #model
  #currentPosition
  #inputWindow
  /**
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {ViewManager} view 
   * @param {ModelManager} model 
   */
  constructor(canvas, view, model) {
    this.#canvas = canvas
    this.#view = view
    this.#model = model
    this.#currentPosition = new CursorPosition(this.#model)
    this.#inputWindow = new InputWindow(this.canvas, this.#view.getAreaOfPath(this.#currentPosition.getPath()))
    this.#canvas.parentElement.onclick = (e) => {
      e.preventDefault()
      this.onClick(e)
    }
    this.#canvas.parentElement.setAttribute('tabIndex', 0)
    this.#canvas.parentElement.addEventListener('keydown', e => {
      this.onKeyDown(e)
    })
  }

  get canvas() {
    return this.#canvas
  }

  resetCursor() {
    this.#currentPosition.reset()
  }

  #getViewPathAndAreaFromEvent = (e) => {
    const { top, left } = this.canvas.getBoundingClientRect();
    return this.#view.getAreaAndPathIfCollided(e.clientX - left, e.clientY - top)
  }

  onClick(e) {
    if (this.#inputWindow.isActive) {
      return
    }
    const pathAndArea = this.#getViewPathAndAreaFromEvent(e)
    if (!pathAndArea) return
    const { path, area, elementType } = pathAndArea

    this.#currentPosition.setPath(path)

    if (elementType === ElementType.FOLDING_BUTTON) {
      this.#model.update(path, !(this.#model.getValue(path)))
      this.#reflectChange()
      return
    }

    if (e.detail === 1) {
      this.#onSingleClick(area)
    } else if (e.detail === 2) {
      this.#onDoubleClick(path, area)
    }
  }

  #onSingleClick(area) {
    this.#inputWindow.moveTo(area)
  }

  #onDoubleClick(path, area) {
    const onUpdateDelegate = (value) => {
      this.#model.update(path, value)
      this.#reflectChange()
    }

    this.#inputWindow.activateAt(this.#model.getValue(path), area, (v) => { onUpdateDelegate(v) })
  }

  #adjustInputWindowPosition() {
    this.#inputWindow.moveTo(this.#view.getAreaOfPath(this.#currentPosition.getPath()))
  }

  #cursorUp() {
    this.#currentPosition.goUp()
    this.#adjustInputWindowPosition()
  }

  #cursorDown() {
    this.#currentPosition.goDown()
    this.#adjustInputWindowPosition()
  }

  /**
   * Path が示す行が SubTitle であることを前提として、その行の isFolding を示す path を返却します
   * @param {JsonPath} path 
   * @returns {JsonPath}
   */
  #getIsFoldingPath(path) {
    const newKeys = path._keys
    newKeys[0] = 'isFolding'
    return new JsonPath(newKeys)
  }

  #onArrowLeft() {
    const currentPath = this.#currentPosition.getPath()
    if (this.#model.getType(currentPath) === ElementType.SUB_TITLE) {
      this.#model.update(this.#getIsFoldingPath(currentPath), true)
      this.#reflectChange()
    } else {
      this.#currentPosition.goLeft()
      this.#adjustInputWindowPosition()
    }
  }

  #onArrowRight() {
    const currentPath = this.#currentPosition.getPath()
    if (this.#model.getType(currentPath) === ElementType.SUB_TITLE) {
      this.#model.update(this.#getIsFoldingPath(currentPath), false)
      this.#reflectChange()
    } else {
      this.#currentPosition.goRight()
      this.#adjustInputWindowPosition()
    }
  }

  #reflectChange() {
    this.#view.update(this.#model.getData())
  }

  #insertNewRecord() {
    this.#model.insertNewRecord(this.#currentPosition.getPath())
    this.#reflectChange()
  }

  #onCtrlEnter() {
    this.#insertNewRecord()
  }

  #onEnterKey() {
    const onUpdateDelegate = (value) => {
      this.#model.update(this.#currentPosition.getPath(), value)
      this.#reflectChange()
    }
    this.#inputWindow.activate(this.#model.getValue(this.#currentPosition.getPath()), (v) => { onUpdateDelegate(v) })
  }

  #onDeleteKey() {
    this.#model.update(this.#currentPosition.getPath(), "")
    this.#reflectChange()
  }

  #onCtrlDelete() {
    this.#model.removeRecord(this.#currentPosition.getPath())
    this.#reflectChange()
  }

  #onShiftTab() {
    this.#model.shallowRow(this.#currentPosition.getPath())
    this.#reflectChange()
    this.#adjustInputWindowPosition()
  }

  #onTabKey() {
    this.#model.deepenRow(this.#currentPosition.getPath())
    this.#reflectChange()
    this.#adjustInputWindowPosition()
  }

  #onInputWindowKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault()
      this.#inputWindow.update()
      this.#inputWindow.deactivate()
      this.#canvas.parentElement.focus()
    }
    if (e.key === "Esc" || e.key === "Escape") {
      e.preventDefault()
      this.#inputWindow.deactivate()
      this.#canvas.parentElement.focus()
    }
  }

  onKeyDown(e) {
    if (this.#inputWindow.isActive) {
      this.#onInputWindowKeyDown(e)
      return
    }
    e.preventDefault()
    switch (e.key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        this.#cursorDown()
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        this.#cursorUp()
        break;
      case "Left": // IE/Edge specific value
      case "ArrowLeft":
        this.#onArrowLeft()
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        this.#onArrowRight()
        break;
      case "Enter":
        if (e.ctrlKey) {
          return this.#onCtrlEnter()
        }
        this.#onEnterKey()
        break;
      case "Esc": // IE/Edge specific value
      case "Escape":
        // Do something for "esc" key press.
        break;
      case "Delete":
        if (e.ctrlKey) {
          return this.#onCtrlDelete()
        }
        this.#onDeleteKey()
        break;
      case "Tab":
        if (e.shiftKey) {
          return this.#onShiftTab()
        }
        return this.#onTabKey()
      default:
        return; // Quit when this doesn't handle the key event.
    }
  }
}

export default ControllerManager
