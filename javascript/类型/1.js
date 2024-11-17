console.log(isANumber(1.1));
console.log(isANumber("1"));
console.log(isANumber("hel"));
console.log(isFinite( 10 / 0));
function isANumber(a) {
    return !isNaN(parseFloat(a));
}
