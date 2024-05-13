
const form = document.querySelector("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const logOut = document.getElementById("login-link");

// Ecouteur formulaire connexion

// verification email mdp avec regex
function validateEmail(email) {
  const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return regex.test(email);
}

function validatePassword(password) {
  // Au moins 6 caractères, une lettre majuscule, une lettre minuscule et un chiffre
  const regex = /^.{0,}$/;
  return regex.test(password);
}

// recupération de l'email et du MdP

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userEmail = email.value;
  const userPassword = password.value;
  document.getElementById('error').innerHTML = '';
   // Vérifiez l'email et le mot de passe avant d'envoyer la requête
   if (!validateEmail(userEmail)) {
    return;
  }

  if (!validatePassword(userPassword)) {
    return;
  }
  const login = {
    email: userEmail,
    password: userPassword,
  };
  const user = JSON.stringify(login);

  // request POST
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: user,
  })
    // recupération de la réponse de la base de donnée
    .then((response) => {
      // console.log(response);
      if (!response.ok) {
        email.style.border = "2px solid #FF0000";
        password.style.border = "2px solid #FF0000";
        const errorLogin = document.querySelector("p");
        errorLogin.textContent =
          "Le mot de passe ou l'identifiant que vous avez fourni est incorrect.";
        throw new Error("Le mot de passe ou l'identifiant que vous avez fourni est incorrect.");
      }
      return response.json(); // Récupération de la réponse en JSON
    })
    .then((data) => {
      // Récupération des donnés Token et id de l'utilisateur une fois la response terminé
      // console.log(data);
      const userId = data.userId;
      const userToken = data.token;
      window.sessionStorage.setItem("token", userToken);
      window.sessionStorage.setItem("userId", userId);
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Une erreur est survenue : ", error);
    });
});