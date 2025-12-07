import { readFileSync } from "fs";
import { join } from "path";

const inputPath = join(__dirname, "./", "inputs", "day01.txt");
// const inputPath = join(__dirname, "./", "inputs", "day01_trivial.txt");
const raw = readFileSync(inputPath, "utf-8").trimEnd();
const lines = raw.split("\n");
enum DIRECTION {
    LEFT = "L",
    RIGHT = "R"
}


/**
 * day1 - part1 solution
 * -------------
 * 
 * If we start at 50 (per the problem statement) and move L38, it
 * means we calculate 50-38 = 12. Similarly for R38 except we add the
 * value instead of subtracting it.
 * 
 * We can do the calcualtion, resolve the bounds of the combo-number
 * range (0-99)
 */
let current = 50;
const inputLineRe = /^(\D)(\d+)$/;
let result = 0;
// Move line by line, updating the current combination number at each step
for(let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matches = line.match(inputLineRe);
    const direction = matches?.[1];
    //Resolve the magnitude to something under 100 since 100 is just
    //one full rotation around the combination lock.
    //e.g. Left 82 is the same as Left 182.
    const magnitude = (parseInt((matches?.[2] ?? "0")) % 100);
    let newPosition = current;
    newPosition = direction == DIRECTION.LEFT ? (current-magnitude) : (current+magnitude)
    if(newPosition < 0) {
        newPosition = 100 + newPosition;
    }
    else if(newPosition >= 100) newPosition = newPosition - 100;
    if(newPosition == 0) result++;
    current = newPosition;
}
console.log(`Part1 result is: ${result}`);

/**
 * day1 - part2 solution
 * -------------
 * 
 * Need to count how many times it both goes PAST zero and/or lands ON zero.
 */
current = 50;
result = 0;
// Move line by line, updating the current combination number at each step
for(let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matches = line.match(inputLineRe);
    const direction = matches?.[1];
    
    // If we divide by 100 we get the number of times it passed zero again.
    const rawMag = parseInt((matches?.[2] ?? "0"));
    result += Math.floor(rawMag / 100);
    const magnitude = (rawMag % 100);
    let newPosition = current;
    newPosition = direction == DIRECTION.LEFT ? (current-magnitude) : (current+magnitude)

    // When the combination passes zero (goes out of bounds, e.g. lt0 or gteq100)
    // it means we touched zero on a click. But we only add that result if the starting (current)
    // position is not already zero. If the starting position was zero we don't count it twice.
    if(newPosition < 0) {
        newPosition = 100 + newPosition;
        if(current != 0 && newPosition != 0) result++;
    }
    else if(newPosition >= 100) {
        newPosition = newPosition - 100;
        if(current != 0 && newPosition != 0) result++;
    }

    if(newPosition == 0) result++;
    current = newPosition;
}
console.log(`Part2 result is: ${result}`);