"use strict";

import DataValidation from "../../model/ruleParts/dataValidation.js";

const cursorBorderWidth = 4
const choiceBorderWidth = 1
const elementId = 'choiceBase'

const listTop = 0
const listLeft = 0
const listWidth = 300
const choiceHeight = 24

const listHeight = (listCount) => {
  const maxShowNum = 4
  const minHeight = choiceHeight / 2
  const maxHeight = minHeight + (choiceHeight * maxShowNum)
  if (listCount === 0) {
    return minHeight
  }
  if (listCount > maxShowNum) {
    return maxHeight
  }
  return choiceHeight * listCount
}

/**
 * 
 * @param {value} value 
 * @returns {HTMLDivElement}
 */
const neutralChoice = (value) => {
  const elem = document.createElement('div')
  elem.style.height = `${choiceHeight}px`
  elem.style.width = `${listWidth}px`
  elem.innerText = value
  elem.style.backgroundColor = 'white'
  return elem
}

/**
 * 
 * @param {value} value 
 * @returns {HTMLDivElement}
 */
const selectedChoice = (value) => {
  const elem = neutralChoice(value)
  elem.style.backgroundColor = 'cyan'
  return elem
}

/**
 * 
 * @param {string} value 
 * @param {boolean} isSelecting 
 * @returns {HTMLDivElement}
 */
const conditionalChoiceElement = (value, isSelecting) => {
  return isSelecting ? selectedChoice(value) : neutralChoice(value)
}

const messageHeight = choiceHeight / 2

/**
 * 
 * @param {boolean} isValid 
 * @returns {HTMLDivElement}
 */
const validationMessageElement = (isValid) => {
  const elem = document.createElement('div')
  elem.style.height = `${messageHeight}px`
  elem.style.width = `${listWidth}px`
  if (isValid) {
    elem.style.backgroundColor = 'LightGreen'
    elem.style.color = 'darkgreen'
    elem.style.fontSize = "8pt"
    elem.innerText = "validation:OK"
  } else {
    elem.style.backgroundColor = 'LightCoral'
    elem.style.color = 'red'
    elem.style.fontSize = "8pt"
    elem.innerText = "validation:NG"
  }
  return elem
}

/**
 * 
 * @returns {HTMLDivElement} 生成した div element
 */
const baseElement = (top, left) => {
  const elem = document.createElement('div')
  elem.style.position = 'absolute';
  elem.style.display = 'none'
  elem.style.top = `${top}px`
  elem.style.left = `${left}px`
  elem.style.width = `${listWidth}px`
  elem.style.height = `${listHeight(0)}px`
  elem.style.backgroundColor = 'white'
  elem.style.overflowX = 'hidden'
  elem.style.overflowY = 'scroll'
  elem.id = elementId
  return elem
}

class InputChoiceList {
  /**
   * リスト選択によって選ばれた値
   * @type {string}
   */
  #selectingValue

  /**
   * 絞り込みに用いている値
   * @type {string}
   */
  #filterValie

  /**
   * @type {DataValidation}
   */
  #validation

  /**
   * @type {HTMLDivElement}
   */
  #baseElement

  /**
   * @type {number}
   */
  #textBoxTop

  /**
   * @type {number}
   */
  #textBoxLeft

  constructor() {
    this.#baseElement = baseElement(0, 0)
  }

  get element() {
    return this.#baseElement
  }

  showList() {
    this.#baseElement.style.display = 'block'
  }

  hideList() {
    this.#baseElement.style.display = 'none'
  }

  #validate(value) {
    this.#baseElement.appendChild(validationMessageElement(this.#validation.isValid(value)))
  }

  /**
   * 
   * @param {number} top 
   * @param {number} left 
   * @param {DataValidation} validation 
   */
  activate(currentValue, top, left, validation) {
    if (!validation) {
      this.hideList()
      return
    }
    this.#validation = validation
    this.#textBoxLeft = parseInt(left, 10)
    this.#textBoxTop = parseInt(top, 10)
    this.showList()
    this.updateFilter(currentValue)
  }

  deactivate() {
    this.hideList()
  }

  /**
   * 
   * @returns {string[]}
   */
  #getFilteredList() {
    return this.#validation.examples.filter(e => e.startsWith(this.#filterValie))
  }
  /**
   * ListElement の内容を更新します
   */
  #reloadElements() {
    const list = this.#getFilteredList()
    this.#baseElement.innerHTML = ''
    if (list.length === 0) {
      this.#validate(this.#filterValie)
    }
    for (const value of list) {
      this.#baseElement.appendChild(conditionalChoiceElement(value, value === this.#selectingValue))
    }
    const newHeight = listHeight(list.length)
    this.#baseElement.style.height = `${newHeight}px`
    this.#baseElement.style.top = `${this.#textBoxTop - newHeight}px`
    this.#baseElement.style.left = `${this.#textBoxLeft}px`
  }
  updateFilter(value) {
    this.#filterValie = value
    this.#reloadElements()
  }
  #adjustScroll() {
    const currentIndex = this.#getFilteredList().indexOf(this.#selectingValue)
    const height = parseInt(this.#baseElement.style.height, 10)
    const top = this.#baseElement.scrollTop
    const bottom = top + height
    if (currentIndex * choiceHeight < top) this.#baseElement.scrollTop = currentIndex * choiceHeight
    if ((currentIndex + 1) * choiceHeight > bottom) this.#baseElement.scrollTop = (currentIndex + 1) * choiceHeight - height
  }
  #moveSelection(moveFunc) {
    const currentIndex = this.#getFilteredList().indexOf(this.#selectingValue)
    const nextIndex = currentIndex === -1 ? 0 : moveFunc(currentIndex)
    this.#selectingValue = this.#getFilteredList()[nextIndex]
    this.#reloadElements()
    this.#adjustScroll()
    return this.#selectingValue
  }
  selectDown() {
    return this.#moveSelection((currentIndex) => Math.min(this.#getFilteredList().length - 1, currentIndex + 1))
  }
  selectUp() {
    return this.#moveSelection((currentIndex) => Math.max(0, currentIndex - 1))
  }
  get hasList() {
    return this.#getFilteredList().length > 0
  }
}

export default InputChoiceList