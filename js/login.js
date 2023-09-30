import settings from "./settings.js";
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const login = document.getElementById("login");

if (email.value == "" || senha.value == "") {
  login.addEventListener("click", async function (event) {
    try {
      const response = await fetch(
        `${settings.ApiUrl}/checkLogin/${email.value}/${senha.value}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);
      if (data) {
        window.location.href = "dashboard.html";
      } else {
        alert("Usuário ou senha incorretos");
      }
    } catch (error) {
      console.log(error);
    }
  });
}
