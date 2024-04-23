// Variables to control the state of the animations
let isLustAnimating = false;
let isCuriosityAnimating = false;
let isGreedAnimating = false;
let animationStartedAt = 0;
let animationFinishedAt = 0;
let isAnimationFinished = false;
// Variable to control the state of the final psychedelic environment
let isAnimating = false; // Variable to control what elements are displayed on the canvas

// Variables for sine wave animation
let xspacing = 16; // Distance between each horizontal location
let w; // Width of entire wave
let h; // Height of entire wave
let theta = 0.0; // Start angle at 0
let amplitude = 35.0; // Height of wave
let period = 500.0; // How many pixels before the wave repeats
let dx; // Value for incrementing x
let xvalues; // Using an array to store horizontal height values for the wave

// Variables for ball wave animation
let numBalls = 16; // Number of balls in the wave
let ballSize = 30; // Diameter of each ball
let ballX = []; // X position of each ball
let ballY = []; // Y position of each ball
let ballSpeed = 2; // Speed at which the balls move vertically
let ballColors = []; // Color of each ball

function setup() {
  createCanvas(800, 600);
  w = width + 16;
  h = height + 16;
  dx = (PI * 8 / period) * xspacing;
  xvalues = new Array(floor(w / xspacing));

  // Initialize ball positions and colors
  for (let i = 0; i < numBalls; i++) {
    ballX.push(i * (width / numBalls));
    ballY.push(height / 2);
    ballColors.push(color(random(255), random(255), random(255)));
  }
}

function draw() {
  background(0);
  // Logic to display the transition view once the animation is done
  if (isAnimationFinished) {
    displayNextView();
  } else if(isAnimating) {
     drawStickFigure();
  } else  {
    drawStickFigure();
    drawTreasureChests();
  }

  // Trigger animations based on state
  if (isLustAnimating) {
    animateLust();
  } else if (isCuriosityAnimating) {
    animateCuriosity();
  } else if (isGreedAnimating) {
    animateGreed();
  }
}

function drawStickFigure() {
  // Set stroke color to white
  stroke(255);
  line(400, 300, 400, 400); // Body
  line(400, 350, 370, 330); // Left arm
  line(400, 350, 430, 330); // Right arm
  line(400, 400, 380, 450); // Left leg
  line(400, 400, 420, 450); // Right leg
  circle(400, 275, 50); // Head
}


function drawTreasureChests() {
  // Enhanced treasure chests visuals
  // Chest for Lust
  fill('red');
  ellipse(150, 140, 120, 80); // Lust Chest base
  fill(255, 192, 203); // Light pink
  arc(150, 140, 120, 80, PI, 0, CHORD); // Lust Chest lid
}

// Display the next view after animations finish
function displayNextView() {
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  text("Final View", width/2, height/2);
}

// Function to check if the mouse was clicked on a particular treasure chest
function mouseClicked() {
  resetAnimations();

  if (dist(mouseX, mouseY, 150, 140) < 60) {
    isLustAnimating = true;
    isAnimating = true;
    animationStartedAt = millis();
  } 
}

function resetAnimations() {
  isLustAnimating = false;
  isAnimationFinished = false;
}

// Animation for 'Lust'
function animateLust() {
  let elapsedTime = millis() - animationStartedAt;
  if (elapsedTime < 5000) { // 5-second animation (adjusted from 3 seconds)
    // Draw balls for each wave
    drawWaveAroundStickFigure(0); // Top
    drawWaveAroundStickFigure(HALF_PI); // Right
    drawWaveAroundStickFigure(PI); // Bottom
    drawWaveAroundStickFigure(3 * HALF_PI); // Left
    drawWaveAroundStickFigure(PI / 4); // Top-Right
    drawWaveAroundStickFigure(3 * PI / 4); // Bottom-Right
    drawWaveAroundStickFigure(5 * PI / 4); // Bottom-Left
    drawWaveAroundStickFigure(7 * PI / 4); // Top-Left
    theta += 0.1; // Modified speed
  } else {
    isLustAnimating = false;
    isAnimationFinished = true;
    animationFinishedAt = millis();
  }
}

// Function to draw a single wave arranged around the stick figure
function drawWaveAroundStickFigure(direction) {
  let stickFigureCenterX = 400; // X-coordinate of stick figure's center
  let stickFigureCenterY = 325; // Y-coordinate of stick figure's center
  let radius = 200; // Radius of the circle around the stick figure

  for (let i = 0; i < numBalls; i++) {
    let phaseOffset = map(i, 0, numBalls - 1, 0, TWO_PI); // Offset phase based on ball index
    let angle = TWO_PI / numBalls * i + direction; // Angle around the stick figure's circle
    let x = stickFigureCenterX + radius * cos(angle);
    let y = stickFigureCenterY + radius * sin(angle);
    let waveDirection = atan2(stickFigureCenterY - y, stickFigureCenterX - x);
    let wavePhase = waveDirection - HALF_PI;
    let ballHeight = ballSize + amplitude * sin(TWO_PI / period * (i + 1) + theta + phaseOffset + wavePhase);
    fill(ballColors[i]);
    ellipse(x, y, ballSize, ballHeight); // Adjusted ballHeight to create stretching effect
  }
}

