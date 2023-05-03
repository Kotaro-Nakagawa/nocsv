"use strict"

import jsonManager from "./model/jsonManager.js"
import ViewManager from "./view/viewManager.js"
import ControllerManager from "./controller/controllerManager.js"

console.log('load succeed')
const inputElement = document.getElementById('input')
const outputElement = document.getElementById('output')
const button = document.getElementById('testbutton')
const editor = document.getElementById('editor')
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
const viewManager = new ViewManager(canvas)
const controllerManager = new ControllerManager(canvas, viewManager, jsonManager)

button.onclick = () => {
  jsonManager.setData(JSON.parse(inputElement.value))
  viewManager.update(jsonManager.getData())
  outputElement.textContent = JSON.stringify(jsonManager.getData(), undefined, 2);
}

canvas.onclick = (e) => {
  controllerManager.onClick(e)
}
