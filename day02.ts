import { readFileSync } from "fs";
import { join } from "path";

const inputPath = join(__dirname, "./", "inputs", "day02.txt");
// const inputPath = join(__dirname, "./", "inputs", "day02_trivial.txt");
const raw = readFileSync(inputPath, "utf-8").trimEnd();
const lines = raw.split(",").map(line => line.trim());

/**
 * Day2 - Part1
 * 
 * The problem asks us to find, for each range of ids (each line is a range of ids)
 * any id in that range that is invalid. An invalid ID is an id that has a repeating pattern
 * within it, and that ID is made entirely of that pattern repeated twice.
 * So while, 123123 is invalid, 121212 is valid.
 * 
 * Examples:
 * 22 is invalid (2 repeats twice)
 * 2323 is invalid (23 repeats twice)
 * 121212 is valid (12 repeats, but 3 times so its valid)
 * 
 * We know the maximum length of a contiguous subset of digits within an ID is half the length of that ID.
 * Actually, the repeating subset HAS to be exactly half the length of the length of the whole ID.
 * 
 * So that means we only need to check if the left half equals the right half; and
 * we can ignore IDs with odd lengths.
 * 
 * The result is the cumulative sum of all invalid IDs
 */

let resultp1 = 0;
lines.forEach(line => {
    const split = line.split('-');
    const lo = parseInt(split[0]);
    const hi = parseInt(split[1]);

    // For each line, iterate the lo -> hi range inclusive.
    for(let id = lo; id <= hi; id++) {
        // each ID is a number we need to check each digit.
        // we're converting back to a string to make this simpler.
        const idStr = new String(id).toString();

        //ignore IDs with odd lengths
        if(idStr.length % 2) continue;

        //if it's an even length string, compare the first half to the last half.
        const firstHalf = idStr.substring(0, idStr.length/2);
        const secondHalf = idStr.substring(idStr.length/2, idStr.length);
        if(firstHalf == secondHalf) resultp1 += id;
    }
})

console.log(`Day2 Result: ${resultp1}`);

/**
 * Day2 - Part2
 * 
 * Now an ID is invalid if a continguous subset of digits repeats
 * throughout the ID at least 2 times. The entire ID must be made up
 * of that repeating pattern, and it has to occur at least twice.
 * 
 * This means, that the maximum length of the pattern is still ID-length / 2
 * but the minimum length can be 1.
 * 
 * So we can't discriminate between odd/even values anymore.
 * 
 * For the ID to be invalid, we CAN say that the length of the ID must be a multiple of the length of the proposed pattern.
 * So we only need to do a full check of the string (with a pattern) if that criteria is met.
 */
const isInvalid = (idStr: string): boolean => {
    let lo = 0;
    let winLen = 1;
    while(winLen <= idStr.length/2) {
        const curPattern = idStr.substring(lo, winLen);
        lo += winLen;
        let numFrames = Math.floor(idStr.length / winLen);
        let numMatches = 1;
        while(lo+winLen <= idStr.length) {
            if(idStr.length % winLen != 0) break;
            const substr = idStr.substring(lo, lo+winLen);
            if(curPattern != substr) break;
            else numMatches++;
            lo += winLen
        }
        if(numMatches == numFrames) return true;
        lo = 0;
        winLen++;
    }

    return false;
}

let resultp2 = 0;
lines.forEach(line => {
    const split = line.split('-');
    const lo = parseInt(split[0]);
    const hi = parseInt(split[1]);
    for(let id = lo; id <= hi; id++) {
        const idStr = new String(id).toString();
        // console.log(`\nidString: ${idStr}`);
        if(isInvalid(idStr)) {
            // console.log(`---> INVALID! adding to result`);
            resultp2 += id;
        }
    }
});

console.log(`Day2 Result: ${resultp2}`);