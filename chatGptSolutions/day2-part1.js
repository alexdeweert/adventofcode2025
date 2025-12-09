// day02-part1.js
const fs = require("fs");
const path = require("path");

// ---- Parsing ----

function parseRanges(line) {
  return line
    .split(",")
    .map(part => part.trim())
    .filter(part => part.length > 0)
    .map(part => {
      const [startStr, endStr] = part.split("-");
      return {
        start: Number(startStr),
        end: Number(endStr),
      };
    });
}

// ---- Generate all "XX" numbers up to a limit ----

function generateRepeatedNumbers(limit) {
  const result = [];

  // k = half the length (len = 2k)
  for (let k = 1; ; k++) {
    const pow10k = 10 ** k;
    const factor = pow10k + 1; // N = A * (10^k + 1)

    const minA = 10 ** (k - 1);
    const maxAByDigits = pow10k - 1; // largest k-digit number
    const maxAByLimit = Math.floor(limit / factor);
    const maxA = Math.min(maxAByDigits, maxAByLimit);

    if (maxA < minA) {
      // for this and all larger k, there won't be any valid A
      break;
    }

    for (let A = minA; A <= maxA; A++) {
      result.push(A * factor);
    }
  }

  return result.sort((a, b) => a - b);
}

// ---- Main solver ----

function solve(line) {
  const ranges = parseRanges(line);
  if (ranges.length === 0) return 0;

  // Sort ranges by start
  ranges.sort((a, b) => a.start - b.start);

  const maxEnd = Math.max(...ranges.map(r => r.end));

  // All candidate invalid IDs up to the global max
  const candidates = generateRepeatedNumbers(maxEnd);

  let sum = 0;
  let i = 0; // index into candidates

  // Sweep through ranges and candidates in ascending order
  for (const range of ranges) {
    const { start, end } = range;

    // Skip candidates that are below this range
    while (i < candidates.length && candidates[i] < start) {
      i++;
    }

    // Collect candidates that fall into this range
    while (i < candidates.length && candidates[i] <= end) {
      sum += candidates[i];
      i++;
    }

    if (i >= candidates.length) break;
  }

  return sum;
}

// ---- CLI wrapper ----

if (require.main === module) {
  const inputPath =
    process.argv[2] || path.join(__dirname, "../inputs", "day02_trivial.txt");
  const raw = fs.readFileSync(inputPath, "utf8").trim();
  console.log(solve(raw));
}

module.exports = { solve };
