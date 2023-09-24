"use strict";

import Editor from "./lib/editor.js";

const editorElement = document.getElementById('editor')
const editor = new Editor(editorElement)
const inputElement = document.getElementById('input')
const outputElement = document.getElementById('output')

const importButton = document.getElementById('testbutton')
importButton.onclick = () => {
  editor.import(JSON.parse(inputElement.value))
  outputElement.textContent = JSON.stringify(editor.export(), undefined, 2);
}

const exportButton = document.getElementById('exportbutton')
exportButton.onclick = () => {
  outputElement.textContent = JSON.stringify(editor.export(), undefined, 2);
}

/**
 * @type {HTMLInputElement}
 */
const tableWidthSlider = document.getElementById('tableWidth')
tableWidthSlider.oninput = () => {
  editor.displayConfig.setMainWidth(parseInt(tableWidthSlider.value, 10))
}

/**
 * @type {HTMLInputElement}
 */
const titleColorInput = document.getElementById('titleColor')
titleColorInput.oninput = () => {
  editor.displayConfig.setTitleColor(titleColorInput.value)
}


/**
 * @type {HTMLInputElement}
 */
const headerColorInput = document.getElementById('headerColor')
headerColorInput.oninput = () => {
  editor.displayConfig.setHeaderColor(headerColorInput.value)
}


/**
 * @type {HTMLInputElement}
 */
const cellColorInput = document.getElementById('cellColor')
cellColorInput.oninput = () => {
  editor.displayConfig.setCellColor(cellColorInput.value)
}


/**
 * @type {HTMLInputElement}
 */
const subTitleColorInput = document.getElementById('subtitleColor')
subTitleColorInput.oninput = () => {
  editor.displayConfig.setSubTitleColor(subTitleColorInput.value)
}


/**
 * @type {HTMLInputElement}
 */
const borderColorInput = document.getElementById('cellBorderColor')
borderColorInput.oninput = () => {
  editor.displayConfig.setCellBorderColor(borderColorInput.value)
}