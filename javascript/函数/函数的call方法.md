在 JavaScript 中，`call` 是一个函数方法，用于调用一个函数并显式指定其 `this` 的值，同时可以传递参数。

---

### **语法**
```javascript
functionName.call(thisArg, arg1, arg2, ...)
```

- `functionName`：要调用的函数。
- `thisArg`：函数内部 `this` 的指向。如果指定为 `null` 或 `undefined`，`this` 会默认指向全局对象（非严格模式）或 `undefined`（严格模式）。
- `arg1, arg2, ...`：依次传递给函数的参数。

---

### **作用**
1. 显式指定函数的 `this` 值。
2. 实现函数借用（调用一个对象的方法，借用到另一个对象上）。

---

### **示例 1：改变函数的 `this` 指向**

```javascript
function greet(greeting, punctuation) {
    console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: "Alice" };

greet.call(person, "Hello", "!"); 
// 输出: "Hello, Alice!"
```

在这个例子中，`call` 将函数 `greet` 的 `this` 显式设置为 `person` 对象。

---

### **示例 2：函数借用**

```javascript
const person1 = {
    name: "Alice",
    greet: function(age) {
        console.log(`Hi, I'm ${this.name} and I'm ${age} years old.`);
    }
};

const person2 = { name: "Bob" };

// 借用 person1 的 greet 方法
person1.greet.call(person2, 25);
// 输出: "Hi, I'm Bob and I'm 25 years old."
```

这里 `call` 将 `person1.greet` 方法借用到 `person2` 上。

---

### **示例 3：调用内置方法**
`call` 可用于调用数组方法来操作类数组对象。

```javascript
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };

// 使用 Array 的方法操作类数组对象
const result = Array.prototype.join.call(arrayLike, "-");
console.log(result); 
// 输出: "a-b-c"
```

---

### **与 `apply` 的区别**
- **`call`**：参数直接传入，逗号分隔。
- **`apply`**：参数以数组形式传入。

示例对比：
```javascript
function sum(a, b, c) {
    return a + b + c;
}

console.log(sum.call(null, 1, 2, 3)); // 输出: 6
console.log(sum.apply(null, [1, 2, 3])); // 输出: 6
```

---

### **与 `bind` 的区别**
- **`call`**：立即执行函数。
- **`bind`**：返回一个绑定了 `this` 的新函数，需要手动调用。

```javascript
function sayHello() {
    console.log(`Hello, ${this.name}`);
}

const person = { name: "Alice" };

sayHello.call(person); // 立即执行，输出: "Hello, Alice"

const boundSayHello = sayHello.bind(person);
boundSayHello(); // 手动调用，输出: "Hello, Alice"
```

---

### **常见用途**
1. **借用构造函数**（继承时初始化父类属性）：
   ```javascript
   function Parent(name) {
       this.name = name;
   }

   function Child(name, age) {
       Parent.call(this, name); // 借用 Parent 构造函数
       this.age = age;
   }

   const child = new Child("Alice", 10);
   console.log(child); // 输出: { name: "Alice", age: 10 }
   ```

2. **类数组对象操作**：
   ```javascript
   function logArguments() {
       const args = Array.prototype.slice.call(arguments);
       console.log(args);
   }

   logArguments(1, 2, 3); 
   // 输出: [1, 2, 3]
   ```

`call` 是一个非常强大的工具，适用于需要动态指定函数上下文的场景。