function convertToCSV(objArray) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    // 提取标题行（对象的键）
    const headers = Object.keys(array[0]);
    str += headers.join(',') + '\r\n';

    // 提取每个对象的值
    array.forEach(obj => {
        let line = '';
        headers.forEach((header, index) => {
            if (index > 0) line += ',';
            line += obj[header];
        });
        str += line + '\r\n';
    });

    return str;
}

// 示例数据
const jsonObject = [
    { "name": "John", "age": 30, "city": "New York" },
    { "name": "Peter", "age": 25, "city": "London" },
    { "name": "Mike", "age": 32, "city": "Chicago" }
];


// 转换为CSV
const csv = convertToCSV(jsonObject);
console.log(csv);
