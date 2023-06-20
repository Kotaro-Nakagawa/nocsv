"use strict"

import ModelManager from "./model/modelManager.js"
import ViewManager2 from "./view2/viewManager.js"
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
const viewManager2 = new ViewManager2(canvas)

let controllerManager = undefined

button.onclick = () => {
  const modeltest = new ModelManager(JSON.parse(inputElement.value))
  controllerManager = new ControllerManager(canvas, viewManager2, modeltest)
  viewManager2.update(modeltest.getData())
  controllerManager.makeCursor()
  outputElement.textContent = JSON.stringify(modeltest.toJson(), undefined, 2);
}

const exportButton = document.getElementById('exportbutton')

exportButton.onclick = () => {
  outputElement.textContent = JSON.stringify(modeltest.toJson(), undefined, 2);
  // outputElement.textContent = JSON.stringify(jsonManager.getData(), undefined, 2);
}