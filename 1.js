const moveSteps = [[0, 1], [1, 0], [1, 1], [-1, 1]];

let result = moveSteps.some(([row_step, col_step]) => {
    return row_step === -1 && col_step === 1;
});

console.log(result);
