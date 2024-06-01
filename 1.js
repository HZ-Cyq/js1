// // 定义数组
// const array = ["a", "b"];

// // 定义一个空对象
// const object = {};

// // 通过循环逐级创建嵌套对象
// let temp = object;
// for (const key of array) {
//   temp[key] = {};
//   temp = temp[key];
// }

// // 设置值
// temp.value = "Hello World";

// // 获取值
// console.log(object.a.b.value); // 输出: Hello World

let map = new Map();
map.set("1", "111");
map.set("2", "222");
let array = Array.from(map.values());
console.log(array);