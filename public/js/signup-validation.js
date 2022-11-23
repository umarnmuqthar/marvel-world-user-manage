const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const messageBox = document.getElementById("messageBox");

let password1 = passwordInput.value;
let password2 = confirmPasswordInput.value;

const keyStrokeHandler = () => {
  if (password1 !== password2) {
    passwordInput.classList.add("border-danger");
    confirmPasswordInput.classList.add("border-danger");
    messageBox.classList.remove("d-none");
  } else {
    passwordInput.classList.remove("border-danger");
    confirmPasswordInput.classList.remove("border-danger");
    messageBox.classList.add("d-none");
  }
};
passwordInput.addEventListener("keyup", (e) => {
  password1 = passwordInput.value;
  keyStrokeHandler();
});
confirmPasswordInput.addEventListener("keyup", () => {
  password2 = confirmPasswordInput.value;
  keyStrokeHandler();
});
