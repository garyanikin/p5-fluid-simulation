let fluid;
let SCALE;

function setup() {
  const size = Math.min(windowWidth, windowHeight);
  SCALE = Math.ceil(size / N);
  createCanvas(size, size);
  frameRate(30);
  fluid = new Fluid(0.2, 0, 0.0000001, SCALE);
}

function windowResized() {
  const size = Math.min(windowWidth, windowHeight);
  SCALE = Math.ceil(size / N);
  resizeCanvas(size, size);
  fluid = new Fluid(0.2, 0, 0.0000001, SCALE);
}

function draw() {
  stroke(51);
  strokeWeight(2);

  let cx = int((0.5 * width) / SCALE);
  let cy = int((0.5 * height) / SCALE);
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      fluid.addDensity(cx + i, cy + j, random(50, 150));
    }
  }
  for (let i = 0; i < 2; i++) {
    const angle = noise(t) * TWO_PI * 2;
    const v = p5.Vector.fromAngle(angle);
    v.mult(0.2);
    t += 0.01;
    fluid.addVelocity(cx, cy, v.x, v.y);
  }

  fluid.step();
  fluid.renderD();
  //fluid.renderV();
  //fluid.fadeD();
}
