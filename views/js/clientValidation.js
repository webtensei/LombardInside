var username = document.forms["form"]["username"];
var password = document.forms["form"]["password"];

var username_error = document.getElementById("username_error");
var pass_error = document.getElementById("pass_error");

username.addEventListener("textInput", username_Verify);
password.addEventListener("textInput", pass_Verify);

function validated() {
  if (username.value.length < 4) {
    username_error.style.display = "block";
    username.focus();
    return false;
  }
  if (password.value.length < 4) {
    pass_error.style.display = "block";
    password.focus();
    return false;
  }
}
function username_Verify() {
  if (username.value.length >= 3) {
    username_error.style.display = "none";
    return true;
  }
}
function pass_Verify() {
  if (password.value.length >= 3) {
    pass_error.style.display = "none";
    return true;
  }
}
