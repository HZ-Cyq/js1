testKeys();


function testKeys() {
  let map = new Map;
  map.set("1", "11");
  map.set("2", "22");
  map.set("3", "33");
  let array = Array.from(map.keys());
  array.fill()
  console.log(array);
}
