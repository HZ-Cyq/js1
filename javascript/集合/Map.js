testFor()

function testKeys() {
  let map = new Map;
  map.set("1", "11");
  map.set("2", "22");
  map.set("3", "33");
  
  let array = Array.from(map.keys());
  array.fill()
  console.log(array);
}

function testFor() {
  let map = new Map;
  map.set("aa", "11")
  map.set("bb", "22")
  map.set("cc", "33")
  map.delete("bb", "aa");
  for(let [key, value] of map) {
    console.log(key);
    console.log(value);
  }
}