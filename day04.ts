import { readFileSync } from "fs";
import { join } from "path";

const inputPath = join(__dirname, "./", "inputs", "day04.txt");
// const inputPath = join(__dirname, "./", "inputs", "day04_trivial.txt");
const raw = readFileSync(inputPath, "utf-8").trimEnd();
const lines = raw.split("\n");

/**
 * Day4 - Part1
 * 
 * They want you to count the number of toilet paper rolls in the input
 * that can be accessed via forklift.
 * 
 * A roll can be accessed if it has fewer than 4 rolls of paper around it.
 * Each position has up to 8 positions surrounding it.
 * 
 * This is a basic 2D grid interpretation where we check all directions from each
 * point.
 */
const grid: string[][] = [];
lines.forEach(line => {
    grid.push(line.split(''));
})
enum Dir {
    H,
    V
}
const gridw = grid[0].length;
const gridh = grid.length;
//From a co-ordinate position check all positions around it and return true/false
//whether its accessible.
const isAccessible = (x: number, y: number, treatCharAsRoll: string | null = null) => {
    let numRollsAtPerimeter = 0;
    const coords = [
        [x, y-1],
        [x-1, y-1],
        [x+1, y-1],
        [x, y+1],
        [x-1, y+1],
        [x+1, y+1],
        [x-1, y],
        [x+1, y]
    ];
    for(let i = 0; i < coords.length; i++) {
        const coord = coords[i];
        const h = coord[Dir.H];
        const v = coord[Dir.V];

        //Its in bounds
        if(h >= 0 && h < gridw && v >= 0 && v < gridh) {
            const curValue = grid[v][h]
            if(curValue === '@' || curValue == treatCharAsRoll) numRollsAtPerimeter++;
            if(numRollsAtPerimeter > 3) return false;
        }
    }
    return true;
};

let result = 0;
for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[0].length; x++) {
        //If its a roll do the check
        if(grid[y][x] === '@' && isAccessible(x,y)) result++;
    }
}

console.log(`Day4 - Part1 result: ${result}`);

/**
 * Day4 - Part2
 * 
 * Now we need to remove the ones that can be removed
 * and then keep repeating that until no more can be removed.
 * 
 * We need to count how many were removed in total.
 * 
 * For this to work we probably need to create a copy of the original grid,
 * do all the removals on the copy (referencing the original grid for the logic tests),
 * and then update the original grid on each iteration.
 * 
 * If we do zero removals, then we return the final answer.
 * 
 * Could we keep iterating on the grid, but just mark them as toRemove
 * and in the same iteration on the isAccessible thing, treat toRemove positions
 * as rolls - then at the end of the iteration do the removal and keep going.
 */


let lastRemovedCount = 1;
let totalRemoved = 0;

while(lastRemovedCount) {
    lastRemovedCount = 0;
    // //make a deep copy
    // const tempGrid: string[][] = [];
    // grid.forEach(row => {
    //     const tempRow: string[] = [];
    //     row.forEach(col => {
    //         tempRow.push(col);
    //     })
    //     tempGrid.push(tempRow);
    // })
    
    //do the checks but remove if accessible
    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[0].length; x++) {
            if(grid[y][x] === '@' && isAccessible(x,y, '*')) {
                grid[y][x] = '*';
                lastRemovedCount++;
            }
        }
    }

    //Now remove all positions that are accessible and update totalRemoved
    if(lastRemovedCount) {
        for(let y = 0; y < grid.length; y++) {
            for(let x = 0; x < grid[0].length; x++) {
                if(grid[y][x] === '*') {
                    grid[y][x] = '.';
                    totalRemoved++
                };
            }
        }   
    }
}

console.log(`Day4 - Part2 Result: ${totalRemoved}`);