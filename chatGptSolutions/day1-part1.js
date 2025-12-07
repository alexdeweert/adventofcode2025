// day1-part1.js
const fs = require("fs");
const path = require("path");

function solveDay1Part1(input) {
  const lines = input
    .trim()
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0);

  let position = 50;
  let zeroHits = 0;
  const MOD = 100;

  for (const line of lines) {
    const dir = line[0];
    const amount = parseInt(line.slice(1), 10);

    if (dir === "R") {
      position = (position + amount) % MOD;
    } else if (dir === "L") {
      position = (position - amount) % MOD;
      if (position < 0) position += MOD;
    } else {
      throw new Error(`Unexpected direction: ${dir}`);
    }

    if (position === 0) {
      zeroHits++;
    }
  }

  return zeroHits;
}


const inputPath = process.argv[2] || path.join(__dirname, "../inputs", "day01.txt");
const raw = fs.readFileSync(inputPath, "utf8");
console.log(solveDay1Part1(raw));