const COOKIE = 'azerwedding-login';
const SCRIPT_ID = "AKfycbx041oH5X0gznRyUoKxxCF464Nhxg0uWlYWKCXx4E37KULYE5Ju_AraelizsFrXo7k";

const MAIRIE = 1;   // 001
const LAIC = 2;     // 010
const SOIREE = 4;   // 100

let currentUser = null;

// Function to check if invited to a specific event
function isInvitedTo(invitation, event) {
    return (invitation & event) !== 0; // Check if event bit is set
}

// <editor-fold desc="Authentification">

// Step 1: Declare valid logins
const validLogins = [
    {name: 'Marc WADJAHDI', habilitation: MAIRIE + LAIC + SOIREE},
    {name: 'Jade CORNET', habilitation: MAIRIE + LAIC + SOIREE},
    {name: 'test', habilitation: MAIRIE + LAIC},
];

// Helper function to normalize input (remove accents, lowercase, trim, and remove spaces)
function normalizeInput(input) {
    return input
        .normalize("NFD") // Decomposes characters with accents
        .replace(/[\u0300-\u036f]/g, "") // Removes accents
        .toLowerCase() // Converts to lowercase
        .replace(/\s+/g, "") // Removes all spaces
        .trim(); // Trims any surrounding spaces
}

// Check if login is valid by comparing normalized input with valid user IDs
function findUser(login) {
    const normalizedLogin = normalizeInput(login ?? '');
    return validLogins.find(user => normalizeInput(user.name) === normalizedLogin);
}

function autoLogin() {
    const login = getQueryParam('login') ?? getCookie(COOKIE)
    signIn(login)
}

function formLogin() {
    signIn($('#login-input').val());
}

function signIn(login) {
    let user = findUser(login);

    if (!user) return signOut();

    $('#login-page').css('display', 'none')
    $('#page').css('display', 'block').addClass('animated-fast fadeInUpMenu')
    $('#navbar').css('display', 'block').addClass('animated-fast fadeInUpMenu')
    // User is authenticated, show the page and store login in cookie
    setCookie(login);
    currentUser = user;
}

function signOut() {
    localStorage.removeItem(COOKIE)
    $('#login-page').css('display', 'block')
    $('#page').css('display', 'none').addClass('animated-fast fadeInUpMenu')
    $('#navbar').css('display', 'none').addClass('animated-fast fadeInUpMenu')
    currentUser = null;
}

// Get query parameter from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to get a cookie by name
function getCookie(name) {
    return localStorage.getItem(COOKIE)
}

// Set a cookie
function setCookie(login) {
    localStorage.setItem(COOKIE, login)
}

// </editor-fold>
function downloadPlanning() {
    // Create a new <a> element
    const link = document.createElement("a");
    link.style.display = "none"; // Hide the link
    link.download = "12_04_2025_jade_et_marc_planning_marriage.pdf";
    link.href = `assets/wedding/plannings/${isInvitedTo(currentUser.habilitation, SOIREE) ? 1 : 2}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Remove the link after clicking
}

function populateGallery() {
    const gallery = $('#gallery')
    for (let i = 1; i <= 9; i++) {
        const colDiv = $('<div>')
            .addClass('photo-container')
            .click(() => openCarousel(i));
        // Create the img element with a placeholder or dynamic source
        const img = $('<img>')
            .attr('src', `assets/wedding/images/gallery-${i}.jpg`)
            .attr('alt', `Image ${i}`)
            .addClass('img-fluid')
        const overlayDiv = $('<div>').addClass('photo-overlay');

        // Append the image to the column div, then the div to the gallery
        colDiv.append(img);
        colDiv.append(overlayDiv)
        gallery.append(colDiv);
    }
}

function openCarousel(index) {
    let images = ""
    for (let i = 1; i <= 9; i++) {
        images += `<div class="carousel-item ${i === index ? 'active' : ''}">`
        images += `<img src="assets/wedding/images/gallery-${i}.jpg" class="d-block w-100" ">`
        images += `</div>`
    }

    // Create modal HTML
    const modalHtml = `
            <div class="modal fade" id="imageCarouselModal" tabindex="-1" aria-labelledby="carouselModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-body p-0">
                            <div id="carouselExample" class="carousel slide" data-ride="carousel">
                                <div class="carousel-inner">
                                   ${images}
                                </div>
                                <!-- Carousel Controls -->
                                <a class="carousel-control-prev" onclick="$('#carouselExample').carousel('prev')" role="button" data-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Previous</span>
                                </a>
                                <a class="carousel-control-next" onclick="$('#carouselExample').carousel('next')" role="button" data-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Next</span>
                                </a>
                            </div>
                        </div>
                        <!-- Modal close button -->
                        <a id="logout-btn" onclick="$('#imageCarouselModal').modal('hide');" style="position: absolute; display=block;top: 15px; right: 15px; z-index: 9000;"><i class="fa fa-times terracotta"></i></a>
                    </div>
                </div>
        `;

    // Append modal HTML to body and show it
    $('body').append(modalHtml);
    $('#imageCarouselModal').modal('show');

    // Remove the modal from the DOM when closed
    $('#imageCarouselModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });

    // Go to the specified index in the carousel
    $('#carouselExample').carousel(index - 1);
}

function submitForm(event) {
    event.preventDefault();
    const form = document.getElementById('saveDateForm');
    const data = {name: currentUser.name,};
    new FormData(form).forEach((value, key) => data[key] = value);


    fetch(`https://script.google.com/macros/s/${SCRIPT_ID}/exec`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify(data),
    })
        .then(result => {
            form.reset();
            console.log('Success:', result);
        })
        .catch(error => {
            console.error('Error:', error);
        });

}