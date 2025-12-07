const fs = require("fs");
const path = require("path");

function solveDay1Part2(input) {
  const lines = input
    .trim()
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0);

  let position = 50; // starting position
  let zeroHits = 0;
  const MOD = 100;

  for (const line of lines) {
    const dir = line[0];                  // 'L' or 'R'
    const distance = parseInt(line.slice(1), 10);

    const step = dir === "R" ? 1 : -1;

    // simulate every single click
    for (let i = 0; i < distance; i++) {
      position += step;
      // wrap around 0–99
      position %= MOD;
      if (position < 0) position += MOD;

      if (position === 0) {
        zeroHits++;
      }
    }
  }

  return zeroHits;
}

// CLI wrapper, same style as part 1
const inputPath =
  process.argv[2] || path.join(__dirname, "../inputs", "day01.txt");

const raw = fs.readFileSync(inputPath, "utf8");
console.log(solveDay1Part2(raw));
