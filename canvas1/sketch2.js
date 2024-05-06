let isClicked = false; // Variable to track if the user has clicked
let stickPerson;
let door;
let doorX;
let mic, micLevel;
let volumeBarWidth = 20; // Width of the volume bar
let volumeBarHeight; // Height of the volume bar
let psychedelicPhase = false; // Variable to track if the psychedelic animation has started
let psychedelicColor; // Color for the psychedelic animation

function setup() {
  createCanvas(800, 600);
  stickPerson = new StickPerson();
  door = new Door(); // Initialize the Door object
  doorX = width - 50;
  mic = new p5.AudioIn();
  mic.start();
  volumeBarHeight = height / 2; // Set initial height of the volume bar
}

function draw() {
  background(0);
  if (!isClicked) {
    InitialView();
  } else {
    if (!psychedelicPhase) {
      NewView();
      // Update microphone input volume
      micLevel = mic.getLevel();

      // Calculate volume bar height based on microphone input volume
      volumeBarHeight = map(micLevel, 0, 1, 0, height);

      // Draw volume bar
      fill(255);
      rect(width - volumeBarWidth, height - volumeBarHeight, volumeBarWidth, volumeBarHeight);

      // Move stick person towards the door based on microphone input volume
        stickPerson.move(micLevel);
        // Check if stick person touches the door
        if (stickPerson.x >= 600) {
          psychedelicPhase = true; // Start psychedelic animation
          psychedelicColor = color(random(255), random(255), random(255)); // Random color for psychedelic animation
        }

      // Display stick person
      stickPerson.display();
    } else {
      // Psychedelic animation
      fill(psychedelicColor);
      noStroke();
      for (let i = 0; i < 100; i++) {
        ellipse(random(width), random(height), random(20, 200));
      }
    }
  }
}

function mouseClicked() {
  // Set isClicked to true when the user clicks anywhere on the screen
  isClicked = true;
}

function InitialView() {
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(255);
  text("Help Me!", 400, 200);
  
  // Parameters for the stick figure
  let torsoLength = 100; // Length of the torso
  let upperLegLength = 60; // Length of the upper part of the leg
  let lowerLegLength = 40; // Length of the lower part of the leg
  let armLength = 50; // Length of the arm
  let headRadius = 25; // Radius of the head
  let angle = radians(115); // Angle of torso off the ground

  // Calculate torso endpoint
  let torsoEndX = 400 + cos(angle) * torsoLength;
  let torsoEndY = 300 + sin(angle) * torsoLength;
  
  // Push the current drawing style settings
  push();
  // Stick figure with stroke
  stroke(255);
  // Torso
  line(400, 300, torsoEndX, torsoEndY); // Body
  // Left arm
  let leftArmEndX = 325 - cos(angle) * armLength;
  let leftArmEndY = 325 - sin(angle) * armLength;
  line(375, 350, leftArmEndX, leftArmEndY); // Left arm
  // Right arm
  let rightArmEndX = 325 + cos(angle) * armLength;
  let rightArmEndY = 325 - sin(angle) * armLength;
  line(375, 350, rightArmEndX, rightArmEndY); // Right arm
  // Left leg (upper part)
  let leftKneeX = torsoEndX - cos(angle) * upperLegLength;
  let leftKneeY = torsoEndY + sin(angle) * upperLegLength;
  line(torsoEndX, torsoEndY, leftKneeX, leftKneeY); // Left upper leg
  // Left leg (lower part)
  line(leftKneeX, leftKneeY, leftKneeX - 20, leftKneeY + lowerLegLength); // Left lower leg
  // Right leg (upper part)
  let rightKneeX = torsoEndX + cos(angle) * upperLegLength;
  let rightKneeY = torsoEndY + sin(angle) * upperLegLength;
  line(torsoEndX, torsoEndY, rightKneeX, rightKneeY); // Right upper leg
  // Right leg (lower part)
  line(rightKneeX, rightKneeY, rightKneeX + 20, rightKneeY + lowerLegLength); // Right lower leg
  // Head
  circle(400, 300, headRadius * 2); // Head
  // Pop the drawing style settings
  pop();
  
  // Draw cartoon stars above the head separately to ensure no connection lines to the head
  push(); // Isolate the fill to not affect other parts
  fill(255, 255, 0); // Yellow color
  ellipse(380, 260, 20, 20);
  ellipse(420, 250, 30, 30);
  ellipse(460, 270, 25, 25);
  pop();
}

function NewView() {
  // Call the display method of the Door object
  door.display();
}

// Define the Door class
class Door {
  constructor() {
    this.x = 550;
    this.width = 75;
    this.height = 300;
    this.frameWidth = 5; // Width of the door frame
    this.doorColor = color(139, 69, 19); // Brown color for the door
    this.knobSize = 10; // Size of the doorknob
  }

  // Display method to draw the door
  display() {
    // Draw door frame
    fill(0); // Black color for the frame
    rect(this.x - this.frameWidth, 0, this.width + 2 * this.frameWidth, this.height);

    // Draw door
    fill(this.doorColor);
    rect(this.x, 0, this.width, this.height);

    // Draw wooden panes
    stroke(0); // Black color for outlines
    for (let i = 0; i < this.width; i += 10) {
      line(this.x + i, 0, this.x + i, height);
    }
    for (let j = 0; j < this.height; j += 20) {
      line(this.x, j, this.x + this.width, j);
    }

    // Draw doorknob
    fill(0); // Black color for the knob
    ellipse(this.x + this.width - this.knobSize, 150, this.knobSize * 2);
  }
}


// Define the StickPerson class
class StickPerson {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.torsoLength = 100;
    this.armLength = 50;
    this.headRadius = 25;
    this.legLength = 75;
  }

  move(volume) {
    // Calculate movement speed based on volume
    let speed = map(volume, 0, 1, 0, 10);
    // Move stick person towards the door with smooth translation
    this.x = lerp(this.x, doorX - this.headRadius, 0.01 * speed);
  }

  display() {
    // Draw stick person with stroke
    stroke(255);

    // Torso
    line(this.x, this.y, this.x, this.y - this.torsoLength);

    // Left arm
    line(this.x, this.y - this.torsoLength / 2, this.x - this.armLength, this.y);

    // Right arm
    line(this.x, this.y - this.torsoLength / 2, this.x + this.armLength, this.y);
    
    // Left leg
    line(this.x, this.y, this.x - 0.5 * this.armLength, this.y + this.legLength);
    
    // Right leg
    line(this.x, this.y, this.x + 0.5 * this.armLength, this.y + this.legLength);

    // Head
    ellipse(this.x, this.y - this.torsoLength, this.headRadius * 2);
  }
}