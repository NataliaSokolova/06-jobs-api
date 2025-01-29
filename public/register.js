import {
    inputEnabled,
    setDiv,
    message,
    token,
    enableInput,
    setToken,
  } from "./index.js";
  import { showLoginRegister } from "./loginRegister.js";
  import { showJobs } from "./jobs.js";
  
  let registerDiv = null;
  let name = null;
  let email1 = null;
  let password1 = null;
  let password2 = null;
  
  export const handleRegister = () => {
    registerDiv = document.getElementById("register-div");
    name = document.getElementById("name");
    email1 = document.getElementById("email1");
    password1 = document.getElementById("password1");
    password2 = document.getElementById("password2");
  
    const registerButton = document.getElementById("register-button");
    const registerCancel = document.getElementById("register-cancel");
  
    registerButton.addEventListener("click", (e) => {
      if (inputEnabled) {
        e.preventDefault();
        const enteredName = name.value.trim();
        const enteredEmail = email1.value.trim();
        const enteredPassword1 = password1.value.trim();
        const enteredPassword2 = password2.value.trim();
  
        if (!enteredName || !enteredEmail || !enteredPassword1 || !enteredPassword2) {
          message.textContent = "All fields are required.";
          return;
        }
  
        if (enteredPassword1 !== enteredPassword2) {
          message.textContent = "Passwords do not match.";
          return;
        }
  
        // Simulate registration process (replace with actual API call)
        setTimeout(() => {
          message.textContent = "Registration successful!";
          setToken("dummy-token"); // Replace with actual token
          showJobs();
        }, 1000);
      }
    });
  
    registerCancel.addEventListener("click", (e) => {
      if (inputEnabled) {
        e.preventDefault();
        showLoginRegister();
      }
    });
  };
  
  export const showRegister = () => {
    name.value = "";
    email1.value = "";
    password1.value = "";
    password2.value = "";
    setDiv(registerDiv);
  };