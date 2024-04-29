//Data
const baseApiUrl = "http://localhost:5678/api/";
let worksdata;
let categories;

//Elements
let filter;
let gallery;
let modal;
let modalstep = null;
let pictureInput;

//Fetch data Api
window.onload =  () => {
    fetch(`${baseApiUrl}works`)
    .then(response => response.json())
    .then(data => {
        worksdata = data;
        console.log(worksdata);
        getCategories();
        displayGallery(worksdata);
        //admin mode
       adminUserMode();
        })
        .catch(error => console.error(error));
    };
//affichage de la galerie
function displayGallery(worksdata){
    gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    worksdata.forEach(work => {
        const workElement = document.createElement('figure');
        workElement.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>
            ${work.title}
        </figcaption>
        `;
        gallery.appendChild(workElement);
    });
}
// recuperation des categories
function getCategories(){
    fetch(`${baseApiUrl}categories`)
    .then(response => response.json())
    .then(data => {
        categories = data;
        console.log(categories);
        displayFilter(categories);
    })
    .catch(error => console.error(error));
}
// affichage des filtres
function displayFilter(categories){
    filter = document.getElementById('filter');
    const categoryElement = document.createElement('button');
        categoryElement.innerHTML = 'Tous';
        categoryElement.addEventListener('click', () => {
            const worksFiltered = worksdata.filter(work => work.categoryId > 0);
            displayGallery(worksFiltered);
        });
    categories.forEach(category => {
        const categoryElement = document.createElement('button');
        categoryElement.innerHTML = category.name;
        categoryElement.id = category.id;
        categoryElement.addEventListener('click', () => {
            const worksFiltered = worksdata.filter(work => work.categoryId === category.id);
            displayGallery(worksFiltered);
        });
        filter.appendChild(categoryElement);
    });
}

// fonction pour l'admin
function adminUserMode(){
    if (localStorage.getItem('token') !== '') {
        const adminButton = document.createElement('button');
        adminButton.innerHTML = 'Modifier';
        adminButton.addEventListener('click', () => {
            console.log('afficher modal admin')
        });
        document.getElementById('projet').appendChild(adminButton);
    }
    
}