let VSHADER_SOURCE = 
'void main() {\n' +
' gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' +
' gl_PointSize = 10.0;\n' +
' }\n';
let FSHADER_SOURCE = 
'void main() {\n' +
' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
'}\n';
// var VSHADER_SOURCE = 
//   'void main() {\n' +
//   '  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' + // Set the vertex coordinates of the point
//   '  gl_PointSize = 10.0;\n' +                    // Set the point size
//   '}\n';

// // Fragment shader program
// var FSHADER_SOURCE =
//   'void main() {\n' +
//   '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the point color
//   '}\n';
function main() {
  let canvas = document.getElementById("webgl");
  let gl = getWebGLContext(canvas); 
  if(!gl) {
    console.error("Failed to get the rendering context for WebGL");
    return;
  }
  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.error("Failed to initialize shaders");
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
}