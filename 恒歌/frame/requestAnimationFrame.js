const box = document.getElementById('box');
const duration = 2000; // Duration of the animation in milliseconds
const startPosition = 0; // Starting X position
const endPosition = window.innerWidth - box.offsetWidth; // Ending X position

let startTime = null;

function animate(timestamp) {
  if (!startTime) startTime = timestamp; // Set the start time
  const elapsed = timestamp - startTime; // Calculate how much time has passed

  // Calculate the current position of the box
  const progress = Math.min(elapsed / duration, 1); // Ensure progress is between 0 and 1
  const currentX = startPosition + (endPosition - startPosition) * progress;

  // Update the box position
  box.style.transform = `translateX(${currentX}px)`;

  // Continue the animation if it hasn't finished yet
  if (progress < 1) {
    requestAnimationFrame(animate);
  } else {
    // Optionally, restart the animation by resetting startTime
    startTime = null;
    requestAnimationFrame(animate); // Uncomment this line to loop the animation
  }
}

// Start the animation
requestAnimationFrame(animate);
