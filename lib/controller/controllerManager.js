"use strict"

import ElementType from "../common/elementType.js"
import JsonPath from "../common/jsonPath.js"
import ModelManager from "../model/modelManager.js"
import ViewManager from "../view/viewManager.js"
import CursorPosition from "./cursorPosition.js"
import InputWindow from "./inputWindow.js"
import ModelController from "./interface/modelController.js"
import ScrollManager from "./scrollManager.js"

class ControllerManager {
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
   * @type {ModelController}
   */
  #modelController
  /**
   * @type {CursorPosition}
   */
  #currentPosition
  /**
   * @type {InputWindow}
   */
  #inputWindow
  /**
   * 
   * @param {HTMLCanvasElement} canvas
   * @param {ScrollManager} scrollManager 
   * @param {ViewManager} view 
   * @param {ModelManager} model 
   */
  constructor(canvas, scrollManager, view, model) {
    this.#canvas = canvas
    this.#scrollManager = scrollManager
    this.#view = view
    this.#model = model
    this.#modelController = new ModelController(model)
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
    this.#canvas.parentElement.onwheel = (e) => {
      e.preventDefault()
      this.#onWheel(e)
    }
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
      if (e.target.id !== this.#inputWindow.elementId) {
        this.#inputWindow.focus()
      }
      return
    }
    const pathAndArea = this.#getViewPathAndAreaFromEvent(e)
    if (!pathAndArea) return
    const { path, area, elementType } = pathAndArea

    this.#currentPosition.setPath(path)

    if (elementType === ElementType.FOLDING_BUTTON) {
      this.#modelController.toggleSubTableFoldStatus(path)
      this.#reflectChange()
      this.#adjustInputWindowPosition()
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

  /**
   * 
   * @param {WheelEvent} e 
   */
  #onWheel(e) {
    this.#scrollView(e.deltaY)
  }

  #scrollView(direction) {
    if (direction > 0) {
      this.#scrollManager.scrollDown()
    } else if (direction < 0) {
      this.#scrollManager.scrollUp()
    }
    this.#reflectChange()
    this.#adjustInputWindowPosition()
  }

  #keepCursorInWindow() {
    const { width: w, height: h } = this.#canvas
    const cursorArea = this.#view.getAreaOfPath(this.#currentPosition.getPath())
    if (cursorArea.bottom > h) {
      this.#scrollManager.scrollDown(cursorArea.bottom - h)
    }
    if (cursorArea.top < 0) {
      this.#scrollManager.scrollUp(Math.abs(cursorArea.top))
    }
  }

  #cursorUp() {
    this.#currentPosition.goUp()
    this.#keepCursorInWindow()
    this.#reflectChange()
    this.#adjustInputWindowPosition()
  }

  #cursorDown() {
    this.#currentPosition.goDown()
    this.#keepCursorInWindow()
    this.#reflectChange()
    this.#adjustInputWindowPosition()
  }

  #onArrowLeft() {
    const folded = this.#modelController.foldSubTableIfSubTableTitle(this.#currentPosition)
    if (folded) {
      this.#reflectChange()
    } else {
      this.#currentPosition.goLeft()
      this.#adjustInputWindowPosition()
    }
  }

  #onArrowRight() {
    const opened = this.#modelController.openSubTableIfSubTableTitle(this.#currentPosition)
    if (opened) {
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
    this.#modelController.insertNewRecord(this.#currentPosition.getPath())
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
    this.#modelController.clearCell(this.#currentPosition.getPath())
    this.#reflectChange()
  }

  #onCtrlDelete() {
    this.#modelController.deleteRow(this.#currentPosition.getPath())
    this.#reflectChange()
    this.#adjustInputWindowPosition()
  }

  #onShiftTab() {
    this.#model.shallowRow(this.#currentPosition.getPath())
    this.#reflectChange()
    this.#adjustInputWindowPosition()
  }

  #onTabKey() {
    const deepened = this.#modelController.deepenRowOrInsertSubTable(this.#currentPosition)
    this.#reflectChange()
    this.#adjustInputWindowPosition()
    if (!deepened) {
      const updateAndDeepenOriginRow = (value) => {
        this.#model.update(this.#currentPosition.getPath(), value)
        this.#currentPosition.goDown()
        this.#model.deepenRow(this.#currentPosition.getPath())
        this.#reflectChange()
        this.#adjustInputWindowPosition()
      }
      this.#inputWindow.activate(this.#model.getValue(this.#currentPosition.getPath()), (v) => { updateAndDeepenOriginRow(v) })
    }
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
