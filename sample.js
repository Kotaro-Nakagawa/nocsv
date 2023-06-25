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
