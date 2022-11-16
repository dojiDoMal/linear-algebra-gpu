const { GPU } = require('gpu.js');
const gpu = new GPU();


function cpu_add(a, b){

        let c = Array(a.length).fill().map(() => Array(a.length).fill(0));
        const iter = a.length;

        for(i = 0; i < iter; i++){
            for(j = 0; j < iter; j++){
                c[i][j] = a[i][j] + b[i][j]; 
            }    
        }

        return c   
}

/**
 * Função que calcula a soma de duas matrizes a e b (As matrizes precisam ter dimensões iguais)
 * @param {number[]} a - Primeira matriz
 * @param {number[]} b - Segunda Matriz
 * @returns Soma das duas matrizes
 */
function gpu_add(a, b){

    let isVector = false;
    let isMatrix = false;

    if ( a.length == 1 || (!!a[0].length && a[0].length == 1) ) { 
        isVector = true;
    } else {
        isMatrix = true;
    }

    if ( !!isVector ) {
        if ( a.length > 1 ) {
            const kernelOutputSize = [1, a.length];
            const add = gpu.createKernel(function(a, b){
                return a[this.thread.y][this.thread.x] + b[this.thread.y][this.thread.x];
            }).setOutput(kernelOutputSize);
            
            return add(a,b);    
        } else if (a.length == 1) {
            const kernelOutputSize = [a[0].length, 1];
            const add = gpu.createKernel(function(a, b){
                return a[this.thread.x] + b[this.thread.x];
            }).setOutput(kernelOutputSize);
            
            return add(a,b);
        }
    } else if (!!isMatrix) {
        const kernelOutputSize = [a.length, a.length];
        const add = gpu.createKernel(function(a, b){
            return a[this.thread.y][this.thread.x] + b[this.thread.y][this.thread.x];
        }).setOutput(kernelOutputSize);
        
        return add(a,b);
    }  
}

module.exports = {
    cpu_add,
    gpu_add
};
