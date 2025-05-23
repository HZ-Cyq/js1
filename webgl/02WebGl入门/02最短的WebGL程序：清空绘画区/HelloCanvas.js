
function main() {
  // Retrieve <canvas> element
  let canvas = document.getElementById("webgl");
  // Get the rendering context for WebGL
  let gl = getWebGLContext(canvas); 
  if (!gl) {
    console.log("Fail to get the rendering context for WebGL");
    return ;
  }

  // Set clear color
  gl.clearColor(1.0, 0.0, 0.0, 1.0);
  
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}