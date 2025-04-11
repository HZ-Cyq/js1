// 1、导入 命名导出
// 引入的时候，需要加大括号，名字必须对应
import { print1 } from "./user.js";
import { print2 } from "./user.js";
// 也可以重命名
import { print1 as p1 } from "./user.js";

// 2、导入 默认导出
// 引入的时候，不需要加大括号，名字可以任意
 import user2 from "./user2.js"

 // 3、导入 混合导出
import { print3 } from "./user3.js";
import user3 from "./user3.js";

print1();
print2();
p1();
// 打印true
console.log(print1 === p1);

console.log(user2);

print3();
console.log(user3);
