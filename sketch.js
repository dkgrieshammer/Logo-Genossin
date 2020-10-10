/* eslint-disable no-undef, no-unused-vars */

let input;
let logo;
let logoText = ["TRINK —", "GENOSSIN", "LATTEN", "BRUDER"];
let ctx; //rendering context as ref

function setup() {
  let density = displayDensity();
  console.log("dens ", density);
  pixelDensity(1);
  let canvas = createCanvas(windowWidth, windowHeight, SVG);
  ctx = canvas.drawingContext
  textFont("Arial");

  input = new InputBox();
  logo = new Logo();
  // translate(50, 50);
}

function draw() {
  clear();
  push();
  translate(50, 50);
  logo.draw();
  pop();
  noLoop();
  // saveLogo();
}

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

function saveLogo() {
  save("Logo-Genossin.svg");
}

class Logo {
  divider = 24; //its 24 lines inside the rectangle according to the CI manual
  baseSize = 240; //either 240 or 360 to have pixel perfect steps
  sPos = createVector(0, 0);
  ePos = createVector(this.baseSize * 1.0157, this.baseSize);
  lineWidth = 10;

  constructor() {
    this.baseGrid =
      this.getLineWidth(this.sPos.y, this.ePos.y, this.divider) * 2.5;
  }

  draw() {
    // clear();
    stroke(0); //needs to be set for SVG Export
    fill(0); // needs to be set for SVG Export
    this.drawBox();
    this.drawText(logoText);
    // this.drawHelpers(this.sPos, this.ePos, this.divider);
  }

  drawBox() {
    noFill();
    noStroke();
    fill(0);
    strokeWeight(14);

    // rect(50, 50, 250, 250);
    beginShape();
    vertex(this.sPos.x - this.lineWidth, this.sPos.y - this.lineWidth);
    vertex(this.ePos.x + this.lineWidth, this.sPos.y - this.lineWidth);
    vertex(this.ePos.x + this.lineWidth, this.ePos.y + this.lineWidth);
    vertex(this.sPos.x - this.lineWidth, this.ePos.y + this.lineWidth);
    beginContour();
    vertex(this.sPos.x, this.sPos.y);
    vertex(this.sPos.x, this.ePos.y);
    vertex(this.ePos.x, this.ePos.y);
    vertex(this.ePos.x, this.sPos.y);
    endContour();
    endShape(CLOSE);
  }

  drawText(newText) {
    const sPos = (this.ePos.x - this.sPos.x) * (2 / 3);
    fill(0);
    noStroke();
    textStyle(BOLD);
    // const tmpSvg = select('svg')
    // tmpSvg.elt.setAttribute('kerning', '0.5rem')
    // console.log(tmpSvg.elt)
    textSize(70);
    for (let i = 0; i < newText.length; i++) {
      const yPos = (i + 1) * 3 * this.baseGrid;
      let shift = 0
      // text(newText[i], sPos, yPos);
      for(let l = 0; l < newText[i].length; l ++) {
        const letter = newText[i][l]
        text(letter, sPos + shift, yPos)
        shift += textWidth(letter) + 7
      }
      console.log(newText[i][0])
    }
  }

  getLineWidth(start, end, divider) {
    return (end - start) / divider;
  }
  geGridLine(start, end, divider) {
    return getLineWidth(start, end, divider) * 2.5;
  }

  drawHelpers(sVector, eVector, divider) {
    const stepSize = this.getLineWidth(sVector.y, eVector.y, divider);
    const gLineSize = stepSize * 2.5;
    push();
    stroke(255, 0, 0, 50);
    strokeWeight(1);
    noFill();
    for (let i = 0; i < divider; i++) {
      let yPos = sVector.y + i * stepSize;
      line(sVector.x, yPos, eVector.x, yPos);
    }
    stroke(0);
    for (let i = 0; i <= 10; i++) {
      let yPos = sVector.y + i * gLineSize;
      line(sVector.x, yPos, eVector.x, yPos);
    }

    pop();
  }
}

class InputBox {
  xPos = 0;
  yPos = 0;

  constructor() {
    this.createTextArea();
    this.createDownloadButton();
    // this.createSketchButton();
    // this.createPhotoButton();
  }

  createDownloadButton() {
    let button = createButton("download");
    button.position(50, 500, "absolute");
    button.mousePressed(saveLogo);
  }

  createSketchButton() {
    let button = createButton("sketch");
    button.position(140, 500, "absolute");
  }
  createPhotoButton() {
    let button = createButton("camera");
    button.position(210, 500, "absolute");
  }

  createTextArea() {
    let area = createElement("textarea");
    area.attribute("rows", "5");
    area.attribute("cols", "30");
    area.elt.placeholder = "hint text";
    area.elt.value = "Trink — \nGenossin \nLatten \nBruder";
    area.position(50, 400, "absolute");
    area.input(this.onInput);
    this.area = area;
  }

  onInput(e) {
    const input = this.value();
    const upper = input.toUpperCase();
    const lines = upper.split("\n");
    logoText = lines;
    draw();
  }
}
