"use strict"

import ElementType from "../common/elementType.js"
import JsonPath from "../common/jsonPath.js"
import ModelManager from "../model/modelManager.js"
import ViewManager from "../view/viewManager.js"
import InputWindow from "./inputWindow.js"

class ControllerManager {
  #canvas
  #view
  #model
  #currentPath
  #inputWindow
  #currentTableIndex
  #currentRowIndex
  #currentColumnIndex
  /**
   * 
   * @param {HTMLCanvasElement} canvas 
   * @param {ViewManager} view 
   * @param {ModelManager} model 
   */
  constructor(canvas, view, model) {
    this.#currentTableIndex = 0
    this.#currentRowIndex = 0
    this.#currentColumnIndex = 0
    this.#canvas = canvas
    this.#currentPath = new JsonPath([this.#currentRowIndex, this.#currentTableIndex])
    this.#view = view
    this.#model = model
    this.#inputWindow = new InputWindow(this.canvas, this.#view.getAreaOfPath(this.#currentPath))
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
    this.#currentPath = new JsonPath([0, 0])
    this.#inputWindow.moveTo(this.#view.getAreaOfPath(this.#currentPath))
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

    const pathLength = path._keys.length
    if (pathLength === 2) {
      this.#currentTableIndex = path._keys[1]
      this.#currentRowIndex = path._keys[0]
    } else {
      this.#currentTableIndex = path._keys[2]
      this.#currentRowIndex = path._keys[1]
      this.#currentColumnIndex = path._keys[0]
    }

    if (elementType === ElementType.FOLDING_BUTTON) {
      this.#model.update(path, !(this.#model.getValue(path)))
      this.#view.update(this.#model.getData())
      return
    }

    this.#currentPath = path
    if (e.detail === 1) {
      this.onSingleClick(area)
    } else if (e.detail === 2) {
      this.onDoubleClick(path, area)
    }
  }

  onSingleClick(area) {
    this.#inputWindow.moveTo(area)
  }

  onDoubleClick(path, area) {
    const onUpdateDelegate = (value) => {
      this.#model.update(path, value)
      this.#view.update(this.#model.getData())
    }

    this.#inputWindow.activateAt(this.#model.getValue(path), area, (v) => { onUpdateDelegate(v) })
  }

  #maxColumnIndex(tableIndex) {
    return this.#model.getColumns(new JsonPath([0])).length - 1
  }

  #extractIndicesOfRowsNotCollapsed(tableIndex) {
    const ret = []
    const targetTableRows = this.#model.getData()[tableIndex]._rows
    for (let i = 0; i < targetTableRows.length; i++) {
      let foldingDepth = undefined
      const row = targetTableRows[i]
      if (foldingDepth === undefined) {
        ret.push(i)
      } else {
        if (row.depth > foldingDepth) {
          // Do Nothing
        } else {
          ret.push(i)
          foldingDepth = undefined
        }
      }
      if (row.isFolding === true) {
        foldingDepth = row.depth
      }
    }
    return ret
  }

  #belowOrBottomRowIndex(current) {
    const validRows = this.#extractIndicesOfRowsNotCollapsed(this.#currentTableIndex)
    const currentRowValue = parseInt(this.#currentRowIndex, 10)
    return validRows[Math.min(validRows.indexOf(currentRowValue) + 1, validRows.length - 1)]
  }

  #aboveOrTopRowIndex(current) {
    const validRows = this.#extractIndicesOfRowsNotCollapsed(this.#currentTableIndex)
    const currentRowValue = parseInt(this.#currentRowIndex, 10)
    return validRows[Math.max(validRows.indexOf(currentRowValue) - 1, 0)]
  }

  #getAreaOfCurrentPath() {
    if (this.#model.getType(new JsonPath([this.#currentRowIndex, this.#currentTableIndex])) === ElementType.SUB_TITLE) {
      this.#currentPath = new JsonPath(['title', this.#currentRowIndex, this.#currentTableIndex])
      return this.#view.getAreaOfPath(this.#currentPath)
    } else {
      this.#currentPath = new JsonPath([this.#currentColumnIndex, this.#currentRowIndex, this.#currentTableIndex])
      return this.#view.getAreaOfPath(this.#currentPath)
    }
  }

  #cursorUp() {
    this.#currentRowIndex = this.#aboveOrTopRowIndex(this.#currentRowIndex)
    this.#inputWindow.moveTo(this.#getAreaOfCurrentPath())
  }

  #cursorDown() {
    this.#currentRowIndex = this.#belowOrBottomRowIndex(this.#currentRowIndex)
    this.#inputWindow.moveTo(this.#getAreaOfCurrentPath())
  }

  #onArrowLeft() {
    if (this.#model.getType(new JsonPath([this.#currentRowIndex, this.#currentTableIndex])) === ElementType.SUB_TITLE) {
      this.#model.update(new JsonPath(['isFolding', this.#currentRowIndex, this.#currentTableIndex]), true)
      this.#view.update(this.#model.getData())
    } else {
      this.#currentColumnIndex = Math.max(this.#currentColumnIndex - 1, 0)
      this.#inputWindow.moveTo(this.#getAreaOfCurrentPath())
    }
  }
  #onArrowRight() {
    if (this.#model.getType(new JsonPath([this.#currentRowIndex, this.#currentTableIndex])) === ElementType.SUB_TITLE) {
      this.#model.update(new JsonPath(['isFolding', this.#currentRowIndex, this.#currentTableIndex]), false)
      this.#view.update(this.#model.getData())
    } else {
      this.#currentColumnIndex = Math.min(this.#currentColumnIndex + 1, this.#maxColumnIndex(this.#currentTableIndex))
      this.#inputWindow.moveTo(this.#getAreaOfCurrentPath())
    }
  }

  #onEnterKey() {
    const onUpdateDelegate = (value) => {
      this.#model.update(this.#currentPath, value)
      this.#view.update(this.#model.getData())
    }
    this.#inputWindow.activate(this.#model.getValue(this.#currentPath), (v) => { onUpdateDelegate(v) })
  }
  onKeyDown(e) {
    if (this.#inputWindow.isActive) {
      if (e.key === "Enter") {
        e.preventDefault()
        this.#inputWindow.update()
        this.#inputWindow.deactivate()
        this.#canvas.parentElement.focus()
      }
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
        this.#onEnterKey()
        break;
      case "Esc": // IE/Edge specific value
      case "Escape":
        // Do something for "esc" key press.
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  }
}

export default ControllerManager
