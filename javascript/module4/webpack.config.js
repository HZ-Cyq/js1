const path = require("path");
console.log(path.join(__dirname, '/build'));
module.exports = {
    mode: 'development',
    entry:'./src/js/index.js',
    output: {
        "path": path.join(__dirname, '/build'),
        "filename": "boundle.js"
    }
}