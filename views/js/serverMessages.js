const button = document.querySelector(".issueDetector"),
  toast_server = document.querySelector(".toast-server");
(closeIcon = document.querySelector(".close")),
  (progress = document.querySelector(".progress"));

let timer1, timer2;

if (button !== null) {
  toast_server.classList.add("active");
  progress.classList.add("active");

  timer1 = setTimeout(() => {
    toast_server.classList.remove("active");
  }, 6000); //1s = 1000 milliseconds

  timer2 = setTimeout(() => {
    progress.classList.remove("active");
    toast_server.style.display = "none";
  }, 6300);
}

closeIcon.addEventListener("click", () => {
  toast_server.classList.remove("active");

  setTimeout(() => {
    progress.classList.remove("active");
  }, 300);

  clearTimeout(timer1);
  clearTimeout(timer2);
});
