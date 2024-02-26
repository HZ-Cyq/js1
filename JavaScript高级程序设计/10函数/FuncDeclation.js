// 函数声明
function sum(num1, num2) {
    return num1 + num2;
}

// 函数表达式方式
let mul = function(num1, num2) {
    return num1 * num2;
}


// 箭头函数方式
let div = (num1, num2) => {
    return num1 / num2;
}

let minus = new Function("num1", "num2", "return num1 - num2");

console.log(sum(1, 2)); // 3
console.log(mul(1, 2)); // 2
console.log(div(100, 10)); // 10
console.log(minus(10, 5)); // 5

console.log(Math.min(1,2,3));
console.log(Math.prototype);
console.log("hello");