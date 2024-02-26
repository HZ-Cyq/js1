// Math对象属性
console.log(Math.PI);
// min()和max方法
let min = Math.min(3,4,5,3);
console.log(min);

let values = [1,2,3,4,5,6,7,8];
console.log(Math.min(values[0]));
// console.log(Math.min(values));

for(let i = 0; i < 100; i ++) {
    console.log(Math.random() * 1);
}

function func1() {
    function listener() {
        console.log("hello world");
    }
}