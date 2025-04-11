
// 一个简单的元数据存储
const metadata = new Map();

function annotate(target, key, value) {
  if (!metadata.has(target)) {
    metadata.set(target, {});
  }
  metadata.get(target)[key] = value;
}


// 定义 Education 类
class Education {
  primary = '';
  secondary = '';
}

// 定义 Person 类
class Person {
  name = '';
  age = 0;
  education = new Education();
  family = [];
  friend = new Map;
  greet() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }
}
annotate(Person.prototype, 'family', Person);
annotate(Person.prototype, 'friend', Person);
console.log(metadata.get(Person.prototype));
function deepCopyAndConvert(obj, classRef, visited = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj; // 基本类型直接返回
  }
  // 检查循环引用
  if (visited.has(obj)) {
    return visited.get(obj);
  }

  // 创建对应的类实例
  const newObj = new classRef();
 visited.set(obj, newObj);
  // 遍历对象的每一个属性
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    // obj key对应的值为空或者newObj key对应的值为空，返回
    if (!obj[key] || newObj[key] == null || newObj[key] == undefined) {
      continue;
    }
    // Array或者Map
    if (newObj[key] instanceof Array || newObj[key] instanceof Map) {
      let metaInfo = metadata.get(classRef.prototype);
      // metaInfo[key]是元素的类型
      if (!metaInfo || !metaInfo[key]) {
        continue;
      }
      let isMap = newObj[key] instanceof Map;
      for (let key2 in obj[key]) {
        let eleVal;
        if(visited.get(obj[key][key2])) {
          eleVal = visited.get(obj[key][key2]);
        } else {
          eleVal = deepCopyAndConvert(obj[key][key2], metaInfo[key]);
        } 
        if (isMap) {
          newObj[key].set(key2, eleVal);
        } else {
          newObj[key][key2] = eleVal;
        }
        visited.set(obj[key][key2], eleVal);
      }
    } else {
      newObj[key] = deepCopyAndConvert(obj[key], newObj[key].constructor);
    }
    // 其他类型
  }
  return newObj;
}

function deepCopyAndConvert2(obj, classRef, visited = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 检查循环引用
  if (visited.has(obj)) {
    return visited.get(obj);
  }

  // 创建对应的类实例
  const newObj = new classRef();
  visited.set(obj, newObj);

  // 遍历对象的每一个属性
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }

    // 元数据检查
    let metaInfo = metadata?.get(classRef.prototype)?.[key];
    if (metaInfo === undefined) {
      continue;
    }

    // Array或者Map
    if (Array.isArray(newObj[key]) || newObj[key] instanceof Map) {
      let isMap = newObj[key] instanceof Map;
      for (let key2 in obj[key]) {
        if (isMap) {
          newObj[key].set(key2, deepCopyAndConvert(obj[key][key2], metaInfo));
        } else {
          let eleVal = deepCopyAndConvert(obj[key][key2], metaInfo);
          newObj[key][key2] = eleVal;
        }
      }
    } else {
      // 确保构造函数有效
      if (typeof newObj[key]?.constructor === 'function') {
        newObj[key] = deepCopyAndConvert(obj[key], newObj[key].constructor, visited);
      } else {
        newObj[key] = deepCopyAndConvert(obj[key], Object);
      }
    }
  }

  return newObj;
}
// 假设这是一个包含嵌套对象的普通对象
const obj = {
  name: 'John',
  age: 30,
  education: { primary: 'Harvard', secondary: 'High School' },
  family: [{
    "name": "chen",
    "age": 44,
    family: [{
      "name": "chen1",
      "age": 46,
    }, {
      "name": "chen2",
      "age": 47,
    }]
  }, {
    "name": "shu",
    "age": 45,
    family: [{
      "name": "shu1",
      "age": 48,
    }, {
      "name": "shu2",
      "age": 49,
    }]
  }],
  friend: {
    "luo": {
      "name": "luoy",
      age: 27,
    },
    "li": {
      "name": "lizc",
      age: 28,
    }
  },
};
obj.family[0] = obj;
// 使用深拷贝并将其转换为类实例
export const personInstance = deepCopyAndConvert(obj, Person);
console.log(personInstance);

