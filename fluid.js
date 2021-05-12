let N = mobileCheck() ? 16 : 64;
let iter = mobileCheck() ? 4 : 8;
let t = 0;

// function to use 1D array and fake the extra two dimensions --> 3D
function IX(x, y) {
  x = constrain(x, 0, N - 1);
  y = constrain(y, 0, N - 1);
  return x + y * N;
}

// Fluid cube class
class Fluid {
  constructor(dt, diffusion, viscosity, SCALE) {
    this.SCALE = SCALE;
    this.size = N;
    this.dt = dt;
    this.diff = diffusion;
    this.visc = viscosity;

    this.s = new Array(N * N).fill(0);
    this.density = new Array(N * N).fill(0);

    this.Vx = new Array(N * N).fill(0);
    this.Vy = new Array(N * N).fill(0);

    this.Vx0 = new Array(N * N).fill(0);
    this.Vy0 = new Array(N * N).fill(0);
  }

  // step method
  step() {
    let N = this.size;
    let visc = this.visc;
    let diff = this.diff;
    let dt = this.dt;
    let Vx = this.Vx;
    let Vy = this.Vy;
    let Vx0 = this.Vx0;
    let Vy0 = this.Vy0;
    let s = this.s;
    let density = this.density;

    diffuse(1, Vx0, Vx, visc, dt);
    diffuse(2, Vy0, Vy, visc, dt);

    project(Vx0, Vy0, Vx, Vy);

    advect(1, Vx, Vx0, Vx0, Vy0, dt);
    advect(2, Vy, Vy0, Vx0, Vy0, dt);

    project(Vx, Vy, Vx0, Vy0);

    diffuse(0, s, density, diff, dt);
    advect(0, density, s, Vx, Vy, dt);
  }

  addDensity(x, y, amount) {
    const index = IX(x, y);
    this.density[index] += amount;
  }

  addVelocity(x, y, amountX, amountY) {
    const index = IX(x, y);
    this.Vx[index] += amountX;
    this.Vy[index] += amountY;
  }

  renderD() {
    colorMode(HSB, 255);

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const x = i * this.SCALE;
        const y = j * this.SCALE;
        const d = this.density[IX(i, j)];
        fill((d + 50) % 255, 200, d);
        noStroke();
        square(x, y, this.SCALE);
      }
    }
  }

  renderV() {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const x = i * this.SCALE;
        const y = j * this.SCALE;
        const vx = this.Vx[IX(i, j)];
        const vy = this.Vy[IX(i, j)];
        stroke(255);

        if (!(abs(vx) < 0.1 && abs(vy) <= 0.1)) {
          line(x, y, x + vx * this.SCALE, y + vy * this.SCALE);
        }
      }
    }
  }

  fadeD() {
    for (let i = 0; i < this.density.length; i++) {
      const d = density[i];
      density[i] = constrain(d - 0.02, 0, 255);
    }
  }
}
