// 顶点着色器
// Vertex shader program
let VSHADER_SOURCE = 
  'void main() {\n' +
  // vec4是齐次坐标（由4个分量组成的矢量）
  '  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' + // Set the vertex coordinates of the point
  '  gl_PointSize = 10.0;\n' +                    // Set the point size
  '}\n';

// 片元着色器
// Fragment shader program
let FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(2.0, 0.0, 0.0, 0.5);\n' + // Set the point color
  '}\n';

function main() {
  let canvas = document.getElementById("webgl");
  let gl = getWebGLContext(canvas);
  if(!gl) {
    console.error("Failed to get the rendering context for WebGL");
    return;
  }
  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error("Failed to initialize shaders.");
    return;
  }
  // 设置<canvas>的背景色
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 绘制一个点(执行顶点着色器，按照mode参数指定的方式绘制图形）
  // 参数
  //   mode: 指定绘制的方式，可接收以下常量符号：
  //      gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP,
  //      gl.TRIANGLES, gl.TRIANGLE_STRIP, gl.TRIANGLE_FAN
  //    first: 指定从哪个顶点开始绘制（整型数）
  //    count：指定需要绘制多少个顶点（整型数）
  // 返回值 无
  // 错误 INVALID_ENUM 传入的mode参数不是前述参数之一
  //      INVALID_VALUE 参数first或count是负数
  gl.drawArrays(gl.POINTS, 0, 1);
}