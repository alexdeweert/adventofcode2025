import { readFileSync } from "fs";
import { join } from "path";

const inputPath = join(__dirname, "./", "inputs", "day03.txt");
// const inputPath = join(__dirname, "./", "inputs", "day03_trivial.txt");
const raw = readFileSync(inputPath, "utf-8").trimEnd();
const lines = raw.split("\n");

/**
 * Day3 - Part1
 * 
 * We need to find the two numbers that, when concatenated, form the largest value from all possible combos.
 * The numbers used need to be used in order. e.g. they cannot be re-arranged, but dont need to be contiguous.
 * 
 * We move both pointers from lo and lo+1.
 * lo is held until lo+i points at a larger value than lo.
 * we bump lo to lo+i, and keep going.
 */
// let result = 0;
// lines.forEach(line => {
//     let lo = 0;
//     let hi = 1;
//     let max = 0;
//     while(hi <= line.length-1 && lo != hi) {
//         const lov = parseInt(line[lo]);
//         const hiv = parseInt(line[hi]);
//         const combov = parseInt(`${line[lo]}${line[hi]}`);
//         max = Math.max(max, combov);
//         if(hiv > lov && hi < line.length-1) {
//             lo = hi;
//             hi = hi+1;
//         }
//         else if(hi == line.length-1) lo++;
//         else if(hi < line.length-1) hi++;
//     }
//     result += max
// });

// console.log(`Day3Part1 Result: ${result}`);

/**
 * Day 3 - Part 2
 * 
 * Dumb idea - results in combinatorial explosion.
 * Output too large and SLOW
 */
let nullPositions: number[][] = [];
// for(let i = 0; i < 88; i++) {
//     for(let j = i+1; j < 88; j++) {
//         for(let k = j+1; k < 88; k++) {
//             nullPositions.push([i,j,k])
//         }
//     }   
// }
// // For each line, iterate over nullPositions using each entry to mark which indices are null.
// // constuct a number from the line array positions that ARENT null, find the largest value
// // from all the constructed numbers.
// let result2 = 0n;
// lines.forEach((line) => {
//   let max = 0n;
//   nullPositions.forEach((nulls) => {
//     let constructed = '';
//     for (let i = 0; i < line.length; i++) {
//       if (!nulls.includes(i)) {
//         constructed += line[i];
//       }
//     }
//     if (constructed.length === 0) {
//       return;
//     }
//     const value = BigInt(constructed);
//     if (value > max) {
//       max = value;
//     }
//   });
//   result2 += max;
// });

/**
 * Day 3 - Part 2
 * 
 * Had to learn about monotonic stacks to solve this one.
 * You can't quickly generate all possible 12 digit combinations from 100 positions.
 * But since the in-order rule is enforced (the 12 digit numbers must maintain insertion order from the original input line)
 * we can take advantage of a monotonic stack to build the number left to right using a stack.
 */
//The idea is to iterate over the whole line character by character
//we want to push the largest numbers we see to the bottom
//while we still have removals to make. e.g. from bottom to top, the value is decreasing.
//If we can still drop numbers (since we have numRemovals left over; picks to make)
//we greedily choose the largest value by popping any values off the stack smaller than that.
//Since the stack will be used to create the number, the largest number greedily gets pushed down.
//Once we run out of numbers to remove, or we reach the end and there are still removals left over
//we need to ensure the final stack is the correct size, so just pop from the top.
let numBatteries = 12;
let result2 = 0;
lines.forEach(line => {  
  let stack: string[] = [];
  let numRemovals = line.length - numBatteries;
  for(let i = 0; i < line.length; i++) {
    const ch = line[i];

    //while we have things to delete; and
    //there are items in the stack; and
    //the current character is larger than the top of the stack;
    //remove the smaller top stack number and push the larger one.
    //lexographic comparison still functions the same for string ints.
    while(numRemovals && stack.length && ch > stack[stack.length-1]) {
      stack.pop();
      numRemovals--;
    }
    stack.push(ch);
  }

  while(numRemovals > 0) {
    stack.pop();
    numRemovals--;
  }

  const cur = parseInt(stack.join(''));
  result2 += cur;
})

console.log(result2);