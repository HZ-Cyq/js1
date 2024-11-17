function main() {
  let canvas = document.getElementById("canvas");
  if(!canvas) {
    console.error("can not retrive canvas element");
    return ;
  }
  let ctx = canvas.getContext("2d");
  // set a blue color
  ctx.fillStyle = 'rgba(0, 0, 255, 1.0)';
  //  fill a rectangle with the color
  ctx.fillRect(120, 10, 150, 150);
}