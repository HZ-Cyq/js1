// 导入技巧
// 1、一次性导入全部命名导出
import * as user from './user.js'
user.print1();
user.print2();

// 2、动态导入
setTimeout(async() => {
    console.log('开始进行动态导入');
    const module = await import('./user4.js')
    module.print4();
    module.print5();
}, 1000);