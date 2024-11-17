function testFilter() {
  let array1 = [1, 2, 3, 4];
  let array2 = [2, 3, 4];
  let re = array1.filter(ele => array2.includes(ele));
  console.log(re);
}

testFilter();