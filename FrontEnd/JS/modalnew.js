
const modalContent = document.getElementById("modalContent");
const modalGallery = document.querySelector(".modalGallery");
const buttonAddPhoto = document.querySelector(".container-button button");
const modalPortfolio = document.querySelector(".modalPortfolio");
const modalAddWorks = document.querySelector(".modalAddWorks");
const formAddWorks = document.querySelector("#formAddWorks");
const labelFile = document.querySelector("#formAddWorks label")
const paragraphFile = document.querySelector("#formAddWorks p")
const inputTitle = document.querySelector("#title");
const inputCategory = document.querySelector("#categoryInput");
const inputFile = document.querySelector("#file");
const previewImage = document.getElementById("previewImage");


//Fonction Principale pour l'affichage des works dans la Modale
function mainModal() {
  displayCategoryModal();
  if (user) {
    displayModal();
    displayWorksModal();
    closeModalGallery();
    displayModalAddWorks();
    returnToModalPortfolio();
    addWorks();
    prevImg();
    verifFormCompleted();
  }
}
mainModal();

// Affichage de la Modal si conecté grace au click sur le bouton modifié
function displayModal() {
  const modeEdition = document.querySelector(".div-edit span");
  modeEdition.addEventListener("click", () => {
    // console.log("mode édition click");
    modalContent.style.display = "flex";
    modalPortfolio.style.display = "flex";
    modalAddWorks.style.display = "none";
  });
}
// récupération des works + appel displayworksModal
function displayWorksModal() {
  modalGallery.innerHTML = "";
  getWorks().then((works) => {
    //Boucle qui parcours  nos works
    // console.log(works);
    works.forEach((work) => {
      createWorkModal(work);
    });
    deleteWork();
  });
}
// création des balises et injection des donnés a partir du fetchWorks
function createWorkModal(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const span = document.createElement("span")
  const trash = document.createElement("i");
  trash.classList.add("fa-solid", "fa-trash-can");
  trash.id = work.id;
  img.src = work.imageUrl;
  img.alt = work.title;
  span.appendChild(trash)
  figure.appendChild(img);
  figure.appendChild(span);
  modalGallery.appendChild(figure);
}
// fermetures modale
function closeModalGallery() {
  //Fermuture de la modal sur la croix 1
  const xmarkModal = document.querySelector(".modalPortfolio span .fa-xmark");
  xmarkModal.addEventListener("click", () => {
    modalContent.style.display = "none";
  });
  //Fermuture de la modal sur la croix 2
  const xmarkModal2 = document.querySelector(".modalAddWorks span .fa-xmark");
  xmarkModal2.addEventListener("click", () => {
    //Supréssion de la prewiew a clik sur retour dans la modale
    inputFile.value = "";
    previewImage.style.display = "none";
    modalContent.style.display = "none";
  });

  //Fermeture de la modal click en dehors de la modale
  body.addEventListener("click", (e) => {
    if (e.target == modalContent) {
      //Supréssion de la prewiew a clik sur retour dans la modale
    inputFile.value = "";
    previewImage.style.display = "none";
    modalContent.style.display = "none";
      // console.log(e.target);
    }
  });
}

//Supression des works grace a la méthode DELETE & au Token user depuis la poubelle de la modale
//paramétrage pour requette DELETE avec token
const deleteWorkID = {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  mode: "cors",
  credentials: "same-origin",
};
//Supréssion au click sur la poubelle et mise a jour modale et gallery principale
function deleteWork() {
  const trashs = document.querySelectorAll(".fa-trash-can")
   // console.log(trashs);
  trashs.forEach(trash => {
    console.log(trash);
    trash.addEventListener("click", (e) => {
      // console.log(e);
      const workID = trash.id;
      // console.log(trash);
      fetch(`http://localhost:5678/api/works/${workID}`, deleteWorkID).then(
        () => {
          displayWorksModal();
          displayWorksGallery();
        }
      );
    });
  });
}

// affichage au click sur btn:"ajouter-photo" de la modalAddWorks
function displayModalAddWorks() {
  buttonAddPhoto.addEventListener("click", () => {
    modalPortfolio.style.display = "none";
    modalAddWorks.style.display = "flex";
  });
}

// Retour sur modalPortfolio depuis la flèche de la modalAddWorks
function returnToModalPortfolio() {
  const arrowLeftModalWorks = document.querySelector(
    ".modalAddWorks .fa-arrow-left"
  );
  arrowLeftModalWorks.addEventListener("click", () => {
    //Supréssion de la prewiew a clik sur retour dans la modale
    inputFile.value = "";
    previewImage.style.display = "none";
    console.log("coucou");
    modalPortfolio.style.display = "flex";
    modalAddWorks.style.display = "none";
  });
}
// ajout d'un nouveau projet
function validateImageFile(file) {
  // Vérifie que l'extension du fichier est jpg, jpeg, png ou gif
  const regex = /\.(jpe?g|png|gif)$/i;
  return regex.test(file.name);
}
function addWorks() {
  // verification du formulaire et recuperation des champs necessaires uniquement
  formAddWorks.addEventListener("submit", (e) => {
    e.preventDefault();
    // Récupération des Valeurs
    const formData = new FormData(formAddWorks);
    const file = formData.get('image');
    
  // Vérifiez que le fichier est une image
  if (!validateImageFile(file)) {
    alert('Le fichier doit être une image (jpg, jpeg, png, gif)');
    return;
  }
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi du fichier");
        }
        return response.json();
      })
      .then((data) => {
        // console.log("Fichier envoyé avec succès :", data);
        displayWorksModal();
        displayWorksGallery();
        formAddWorks.reset();
        modalPortfolio.style.display = "flex";
        modalAddWorks.style.display = "none";
        previewImage.style.display = "none";
      })
      .catch((error) => {
        console.error("Erreur :", error);
      });
  });
}

// Génère les catégorie dynamiquement pour la modale
async function displayCategoryModal() {
  const select = document.querySelector("form select");
  const categorys = await getCategory();
  categorys.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
// Prévisualisation de l'image
function prevImg() {
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    // console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        // labelFile.style.display ="none"
        // paragraphFile.style.display ="none"
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.style.display = "none";
    }
  });
}
// vérification si tout les inputs sont remplis
function verifFormCompleted() {
  const buttonValidForm = document.querySelector(
    ".container-button-add-work  button"
  );
  formAddWorks.addEventListener("input", () => {
    if (!inputTitle.value == "" && !inputFile.files[0] == "") {
      buttonValidForm.classList.remove("button-add-work");
      buttonValidForm.classList.add("buttonValidForm");
    } else {
      buttonValidForm.classList.remove("buttonValidForm");
      buttonValidForm.classList.add("button-add-work");
    }
  });
}


//repasser la poubelle en 1er plan pour la faire fonctionne 
//Supression des photos modale 
//ni rechargement ni fetch pour recuperer la liste ( traitement sur tableau local)
//verification token ( a connaitre ) 