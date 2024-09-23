/**
 * 创建
 */
function testArrayFromByIterator() {
  let map = new Map;
  map.set("1", "11");
  map.set("2", "22");
  map.set("3", "33");
  let array = Array.from(map.keys());
  console.log(array);
}

/**
 * Array.from方法
 */
function testArrayfrom() {
  let array = Array.from("hello world")
  console.log(array);
}

/**
 * 查
 */
function testIncludes() {
  let array = [1, 2, 3, 4];
  console.log(array.includes(4));
}

/**
 * 填充
 */
function testFill() {
  let array = new Array(10);
  let obj = {
    a: "aa",
    b: "bb",
    c: "cc",
  }
  array.fill(obj);
  obj.a = "bb";
  console.log(array);
}


/**
 * 转换
 */
function testTransform() {
  let person = {
    toString() {
      return "a";
    },
    toLocaleString() {
      return "b";
    }
  };
  let person2 = {
    toString() {
      return "a";
    },
    toLocaleString() {
      return "b";
    }
  };
  let array = [person, person2];
  console.log(array);
  console.log(array.toString());
  console.log(array.toLocaleString());
}

/**
 * 排序
 */
function testSort() {
  let array = [0, 1, 2, 21, 12];
  console.log(array.sort((value1, value2) => value1 - value2));
}

function testIndexOf() {
  let array = [0, 1, 2, 21, 12];
  console.log(array.indexOf(99
    
  ));
}

testIndexOf()