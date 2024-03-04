let buttons = document.querySelectorAll("button");
for(let button of buttons) {
    button.addEventListener("click", createParagraph);
}
function createParagraph() {
    let para = document.createElement("p");
    para.textContent = "您点击了一下按钮";
    document.body.appendChild(para);
}