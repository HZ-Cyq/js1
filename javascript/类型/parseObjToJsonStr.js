let obj = {
    a: "dasda",
    map: new Map,
    c: ["aa", "bb", "cc"],
}

let map2 = new Map();
map2.set("cc", "cc");
map2.set("dd", "dd");
let map3 = new Map();
map3.set("ee", "ee");
map3.set("ff", "ff");

obj.map.set("aa", map2);
obj.map.set("bb", map3);
// console.log(obj);

// console.log(JSON.stringify(obj.map));
//console.log(Object.fromEntries(obj.map));
//console.log(JSON.stringify(Object.fromEntries(obj.map)));

function convertMapInObjectToJSON(obj) {
    if (obj instanceof Map) {
        return JSON.stringify(Object.fromEntries(obj));
    }

    return JSON.stringify(obj, (key, value) => {
        if (value instanceof Map) {
            return Object.fromEntries(value);
        }
        return value;
    });
}

let re = convertMapInObjectToJSON(obj);
console.log(re);