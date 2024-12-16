/**
 * 参考：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
 */
// 通过字面量创建对象
const student = {
    name: "Alice",
    age: 17,
    run:function() {
        return this.name + "," + this.age;
    },
}
console.log(student.run());

// 通过构造函数创建对象

