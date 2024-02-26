// 浏览器将window对象实现为Global对象的代理
// 下面代码执行会有报错，是因为使用node环境运行，没有window
// 可以用浏览器打开WindowObject.html查看效果
var color = "red";
function sayColor() {
    console.log(window.color);
}
window.sayColor();