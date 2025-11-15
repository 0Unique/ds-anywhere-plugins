let pluginContainer = document.querySelector("#plugin-container");

var element = document.querySelector(".full-container");
const panzoom = Panzoom(element, {
  zoomDoubleClickSpeed: 1, // disables zoom on double click
  noBind: true,
});

var selectedWindow = null;
var prevX = 0;
var prevY = 0;

elem.addEventListener("pointerdown", (event) => {
  if (event.ctrlKey) {
    selectedWindow = event.target;
  } else {
    panzoom.handleDown(event);
  }
});
document.addEventListener("pointermove", (event) => {
  if (event.ctrlKey && selectedWindow != null) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    if (prevX != NaN && prevY != NaN) {
      selectedWindow.style.left += mouseX - prevX;
      selectedWindow.style.top += mouseY - prevY;
    }
    prevX = mouseX;
    prevY = mouseY;
  } else {
    panzoom.handleMove(event);
  }
});
document.addEventListener("pointerup", panzoom.handleUp);
document.addEventListener("pointerup", (event) => {
  selectedWindow = null;
  panzoom.handleUp(event);
});
