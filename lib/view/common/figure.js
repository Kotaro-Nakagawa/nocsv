"use strict"

import Area from "./area.js"

class ColorBox extends Area {
  constructor(x, y, width, height, color) {
    super(x, y, width, height)
    this.color = color
  }
  renderMe(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.left, this.top, this.width, this.height)
  }
}

class TextBox extends Area {
  constructor(x, y, width, height, text) {
    super(x, y, width, height)
    this.x = x
    this.y = y
    this.text = text || ''
  }
  renderMe(ctx) {
    ctx.fillStyle = 'black';
    const match = /(?<value>\d+\.?\d*)/;
    ctx.font = ctx.font.replace(match, 16);
    ctx.fillText(this.text, this.x + (this.width * 0.02), this.y + (this.height * 0.8))
  }
}

class FrameBox extends Area {
  constructor(x, y, width, height, color) {
    super(x, y, width, height)
    this.color = color
  }
  renderMe(ctx) {
    ctx.strokeStyle = this.color;
    ctx.strokeRect(this.left, this.top, this.width, this.height)
  }
}

class FoldingButton extends Area {
  constructor(x, y, width, height, color, folding) {
    super(x, y, width, height)
    this.color = color
    this.folding = folding
  }
  renderMe(ctx) {
    ctx.fillStyle = this.color;
    let baseStart
    let baseEnd
    let topPoint
    if (this.folding) {
      // 見た目は >
      baseStart = { x: this.left + this.width * 0.4, y: this.top + this.height * 0.2 }
      baseEnd = { x: this.left + this.width * 0.4, y: this.top + this.height * 0.8 }
      const baseWidth = baseEnd.y - baseStart.y
      topPoint = { x: baseStart.x + baseWidth / 2, y: (baseStart.y + baseEnd.y) / 2 }
    } else {
      // 見た目は v
      baseStart = { x: this.left + this.width * 0.2, y: this.top + this.height * 0.4 }
      baseEnd = { x: this.left + this.width * 0.8, y: this.top + this.height * 0.4 }
      const baseWidth = baseEnd.x - baseStart.x
      topPoint = { x: (baseStart.x + baseEnd.x) / 2, y: baseStart.y + baseWidth / 2 }
    }
    ctx.beginPath()
    ctx.moveTo(baseStart.x, baseStart.y)
    ctx.lineTo(topPoint.x, topPoint.y)
    ctx.lineTo(baseEnd.x, baseEnd.y)
    ctx.closePath();
    ctx.strokeStyle = "rgb(0,0,0)"; //枠線の色
    ctx.stroke();
    ctx.fillStyle = "rgb(0,0,255)";//塗りつぶしの色
    ctx.fill();
  }
}

const figureFactory = (function () {
  return {
    newColorBox: (x, y, width, height, color) => {
      return new ColorBox(x, y, width, height, color)
    },
    newTextBox: (x, y, width, height, text) => {
      return new TextBox(x, y, width, height, text)
    },
    newFrameBox: (x, y, width, height, color) => {
      return new FrameBox(x, y, width, height, color)
    },
    newFoldingButtonBox: (x, y, width, height, color, folding) => {
      return new FoldingButton(x, y, width, height, color, folding)
    }
  }
})()

export default figureFactory
