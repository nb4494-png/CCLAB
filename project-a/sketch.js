/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let balls = [];
let fireSize = 1;
let fireColor = "orange";
let selectedBall = -1;
let eatTimer = 0;

let colors = ["blue", "red", "yellow", "green", "purple"];

function setup() {
  createCanvas(800, 500);
  noStroke();

  for (let i = 0; i < 8; i++) {
    balls.push({
      x: random(40, 760),
      y: random(-500, -20),
      size: 25,
      color: random(colors)
    });
  }
}

function draw() {
  background(0);

  drawHeart(width / 2, height / 2 + 20);

  // Falling and glowing balls
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];

    if (selectedBall != i) {
      b.y += 2;
    } else {
      b.x = mouseX;
      b.y = mouseY;
    }

    if (b.y > height + 20) {
      resetBall(b);
    }

    if (b.color == "blue") {
      fill(40, 140, 255);
      drawingContext.shadowColor = color(40, 140, 255);
    } else if (b.color == "red") {
      fill(255, 45, 45);
      drawingContext.shadowColor = color(255, 45, 45);
    } else if (b.color == "yellow") {
      fill(255, 230, 40);
      drawingContext.shadowColor = color(255, 230, 40);
    } else if (b.color == "green") {
      fill(50, 255, 120);
      drawingContext.shadowColor = color(50, 255, 120);
    } else if (b.color == "purple") {
      fill(180, 70, 255);
      drawingContext.shadowColor = color(180, 70, 255);
    }

    drawingContext.shadowBlur = 25;
    ellipse(b.x, b.y, b.size, b.size);
    drawingContext.shadowBlur = 0;
  }

  drawFire(width / 2, height / 2);

  if (eatTimer > 0) {
    eatTimer--;
  }
}

function mousePressed() {
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];

    if (dist(mouseX, mouseY, b.x, b.y) < b.size) {
      selectedBall = i;
      break;
    }
  }
}

function mouseReleased() {
  if (selectedBall != -1) {
    let b = balls[selectedBall];

    let mouthX = width / 2;
    let mouthY = height / 2 + 43 * fireSize;

    if (dist(b.x, b.y, mouthX, mouthY) < 65 * fireSize) {
      eatTimer = 20;

      if (b.color == "red") {
        // RED = ANGER! Suddenly becomes much bigger.
        fireColor = "red";
        fireSize = min(1.8, fireSize + 0.5);
      } else if (b.color == "blue") {
        // BLUE = CALM. Becomes smaller each time.
        fireColor = "blue";
        fireSize = max(0.45, fireSize - 0.12);
      } else {
        // Other colors change the flame's color only.
        fireColor = b.color;
      }

      resetBall(b);
    }
  }

  selectedBall = -1;
}

function resetBall(b) {
  b.x = random(40, 760);
  b.y = random(-200, -30);
  b.color = random(colors);
}

function drawHeart(x, y) {
  push();
  translate(x, y);

  let d = dist(mouseX, mouseY, x, y);
  let glow = map(d, 0, 250, 255, 30);
  glow = constrain(glow, 30, 255);

  drawingContext.shadowBlur = glow * 0.5;
  drawingContext.shadowColor = color(255, 40, 80, glow);

  stroke(255, 40, 80, glow);
  strokeWeight(10);
  noFill();

  beginShape();

  for (let a = 0; a < TWO_PI; a += 0.03) {
    let hx = 16 * pow(sin(a), 3);
    let hy = -(13 * cos(a)
      - 5 * cos(2 * a)
      - 2 * cos(3 * a)
      - cos(4 * a));

    vertex(hx * 12, hy * 12);
  }

  endShape(CLOSE);
  pop();

  drawingContext.shadowBlur = 0;
}

function drawFire(x, y) {
  push();
  translate(x, y);

  // Grow or shrink around the character's center
  translate(0, 65 * (fireSize - 1));
  scale(fireSize);

  let t = frameCount * 0.04;
  let sway = map(noise(t), 0, 1, -15, 15);
  let tip = map(noise(t + 100), 0, 1, -20, 20);
  let h = map(noise(t + 200), 0, 1, 110, 145);

  translate(sway, 0);

  // Choose the outer and inner flame colors
  if (fireColor == "red") {
    // Angry, fiery red
    fill(255, 0, 25);
  } else if (fireColor == "blue") {
    fill(25, 90, 255);
  } else if (fireColor == "yellow") {
    fill(255, 220, 0);
  } else if (fireColor == "green") {
    fill(20, 220, 80);
  } else if (fireColor == "purple") {
    fill(155, 40, 255);
  } else {
    fill(230, 60, 20);
  }

  // Outer flame
  beginShape();
  vertex(-70, 65);
  vertex(-85, 25);
  vertex(-55, -20);
  vertex(-35, -65);
  vertex(tip, -h);
  vertex(30, -75);
  vertex(55, -35);
  vertex(80, 20);
  vertex(65, 65);
  endShape(CLOSE);

  // Inner flame
  if (fireColor == "red") {
    fill(255, 100, 20);
  } else if (fireColor == "blue") {
    fill(100, 210, 255);
  } else if (fireColor == "yellow") {
    fill(255, 250, 150);
  } else if (fireColor == "green") {
    fill(150, 255, 100);
  } else if (fireColor == "purple") {
    fill(220, 150, 255);
  } else {
    fill(255, 155, 25);
  }

  beginShape();
  vertex(-45, 55);
  vertex(-45, 15);
  vertex(-20, -25);
  vertex(tip * 0.5, -85);
  vertex(25, -30);
  vertex(45, 15);
  vertex(40, 55);
  endShape(CLOSE);

  // Cute eyes
  noStroke();
  fill(40, 30, 25);
  ellipse(-28, 9, 10, 12);
  ellipse(28, 9, 10, 12);

  // White eye highlights
  fill(255);
  ellipse(-30, 6, 4, 4);
  ellipse(26, 6, 4, 4);

  // Pink cheeks
  fill(255, 120, 100, 150);
  ellipse(-43, 30, 17, 9);
  ellipse(43, 30, 17, 9);

  // Mouth opens while eating
  if (eatTimer > 0) {
    fill(80, 20, 30);
    ellipse(0, 43, 25, 10 + eatTimer * 0.5);

    fill(255, 115, 140);
    ellipse(0, 47, 13, 5);
  } else {
    fill(110, 35, 35);
    arc(0, 43, 23, 10, 0, PI);

    fill(255, 115, 110);
    arc(0, 45, 12, 4, 0, PI);
  }

  pop();
}