// 参考：https://geek-docs.com/javascript/javascript-top-articles/1697154316_g_how-to-serialize-a-map-in-javascript.html
const map1 = new Map([
    [1, 2],
    [3, 4],
    [5, 6],
])
const array = Array.from(map1);
console.log(JSON.stringify(array));

const obj = Object.fromEntries(map1);
console.log(JSON.stringify(obj));