// // 1、Date构造方法
// // 当前0时区时间，2024-10-17T00:58:00.334Z（当前北京时间是2024-10-17 08:58:00）
// let now = new Date();
// console.log(now);
// console.log(now.toLocaleString());
// // 0时刻的时间，1970-01-01T00:00:00.000Z
// let time0 = new Date(0);
// console.log(time0);
// console.log(time0.toLocaleString());

// let date = new Date(Date.UTC(2005, 4, 5, 17, 55, 55));
// console.log(date);
// console.log(date.toLocaleString());

// let date2 = new Date(2005, 4, 5, 17, 55, 55);
// console.log(date2.toLocaleString());

// // Date的方法
// console.log(date2.getTime());
// console.log(date2.valueOf());

function testCreateDate1() {
    // 当前0时区时间，2024-10-17T00:58:00.334Z（当前北京时间是2024-10-17 08:58:00）
    let now = new Date();
    // 打印的值是2024/10/17 08:58:00
    console.log(now.toLocaleString());
    // 0时刻的时间，1970-01-01T00:00:00.000Z
    let time0 = new Date(0);
    // 打印的值是1970/1/1 08:00:00
    console.log(time0.toLocaleString());
}

function testCreateDate2() {
    let date1 = new Date(2024, 9, 17, 10, 13, 0);    
    console.log(date1.toLocaleString());

    let date2 = new Date(Date.UTC(2024, 9, 17, 10, 13, 0));    
    console.log(date2.toLocaleString());
}

function testDateMethod() {
    let date = new Date(2024, 9, 17, 10, 13, 0);    
    console.log(date.getTime());
}

testCreateDate1();











