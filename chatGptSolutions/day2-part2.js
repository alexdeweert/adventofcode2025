// day02-part2.js
const fs = require("fs");
const path = require("path");

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

function generateRepeatedPatternNumbers(limit) {
  const numbers = new Set();
  const maxDigits = String(limit).length;

  for (let blockLen = 1; blockLen <= Math.floor(maxDigits / 2); blockLen++) {
    const minBlock = 10 ** (blockLen - 1);
    const maxBlock = 10 ** blockLen - 1;

    for (let block = minBlock; block <= maxBlock; block++) {
      const blockStr = String(block);

      for (let r = 2; ; r++) {
        const s = blockStr.repeat(r);
        if (s.length > maxDigits) break;

        const n = Number(s);
        if (n > limit) break;

        numbers.add(n);
      }
    }
  }

  return Array.from(numbers).sort((a, b) => a - b);
}

function solve(line) {
  const ranges = parseRanges(line);
  if (ranges.length === 0) return 0;

  ranges.sort((a, b) => a.start - b.start);
  const maxEnd = Math.max(...ranges.map(r => r.end));

  const candidates = generateRepeatedPatternNumbers(maxEnd);

  let sum = 0;
  let i = 0; // index into candidates

  for (const range of ranges) {
    const { start, end } = range;

    // Skip candidates below this range
    while (i < candidates.length && candidates[i] < start) {
      i++;
    }

    // Collect candidates within this range
    while (i < candidates.length && candidates[i] <= end) {
      sum += candidates[i];
      i++;
    }

    if (i >= candidates.length) break;
  }

  return sum;
}

// CLI wrapper
if (require.main === module) {
  const inputPath =
    process.argv[2] || path.join(__dirname, "../inputs", "day02.txt");
  const raw = fs.readFileSync(inputPath, "utf8").trim();
  console.log(solve(raw));
}

module.exports = { solve };
