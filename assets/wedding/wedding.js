const COOKIE = 'azerwedding-login';
const SCRIPT_ID = "AKfycbwx_kckFb439ramFSboqinLQrtXV3uw16EA1AgX97FS2pCq0hPVJv137LZGA16SVFY";

const NB_PHOTO = 16
const TRANSLATIONS = {
    "(min-width: 1000px)": {x: 150, y: 45,},
    "(max-width: 992px)": {x: 75, y: 37,},
    "(max-width: 768px)": {x: 60, y: 30,},
    "(max-width: 480px)": {x: 45, y: 22,},
    "(max-width: 340px)": {x: 30, y: 15,},
}
const ROTATION_RANGE = 60; // Full range: -55 to 55 degrees
const NOISE_RANGE = 7; // Noise range: ±2 to ±4 degrees

const MAIRIE = 1;   // 001
const LAIC = 2;     // 010
const SOIREE = 4;   // 100

const RSVP_RECIPIENTS = ['marc.wadjahdi@gmail.com', 'jadecornet1@gmail.com']

let currentUser = null;

// Function to check if invited to a specific event
function isInvitedTo(invitation, event) {
    return (invitation & event) !== 0; // Check if event bit is set
}

// <editor-fold desc="Authentification">

// Step 1: Declare valid logins
const validLogins = [
    {names: ['Test1'], habilitation: MAIRIE + LAIC},
    {names: ['Test2'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Agence Unicorn', 'Unicorn', 'Licorne', 'Gros la Corne'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Marc Wadjahdi', 'Kako', 'Mumble', 'Marcus Pupuce'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Corinne Wadjahdi', 'Coco des iles'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Jannick Wadjahdi', 'Kakounet'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Jacques Wadjahdi', 'Nanoute'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Vivien Didelot'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Cyril Domergue', 'Diane Le Franc'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Fabien Barretteau', 'Fabien Bertherat', 'Aurélie Barbeau'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Alexandre Thomas', 'Clémence Thomas'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Olivier Thomas'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Nicolas Yamamoto'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Clarisse Devillers', 'Luc Devillers'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Randolph Higa', 'Mylenka Djariman'], habilitation: MAIRIE + LAIC},
    {names: ['Sebastien Perault', 'Khrystyna Perault'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Yverick Hermant'], habilitation: MAIRIE + LAIC},
    {names: ['Roby Didelot', 'Serge Didelot'], habilitation: MAIRIE + LAIC},
    {names: ['Daniel Domergue', 'Marie-Francoise', 'Céline Domergue'], habilitation: MAIRIE + LAIC},
    {names: ['Vincent Domergue', 'Christelle Domergue'], habilitation: MAIRIE + LAIC + SOIREE},

    {names: ['Jade Cornet'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Robin Cornet'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Romane Cornet'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Renaud Cornet', 'Sylvie Marboeuf', 'Claude Cornet'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Eric Esposito', 'Brigitte Esposito'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Kevin Esposito', 'Julie Touyrac'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Philippe Guillou', 'Giliane Guillou', 'Loic Guillou'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Tanguy Boinet', 'Anne-Laure Boinet'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Marine Teral', 'Benoit'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Gabrielle Winter', 'Charles Mori'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Boris Valin', 'Louise Ott-Valin'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Pauline Feuillet'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Hadrian Moret'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Clovis Rivière'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Patricia Merignac'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Jocelyne Merignac', 'Paul Merignac', 'Virginie Merignac'], habilitation: MAIRIE + LAIC},
    {names: ['Natalie Brinon', 'Steeve Brinon', 'Achille Brinon'], habilitation: MAIRIE + LAIC},
    {names: ['Delphine Tanti', 'Louis Tanti-Cornet', 'Ines Tanti-Cornet'], habilitation: MAIRIE + LAIC},
    {names: ['Adrien Giacinti'], habilitation: MAIRIE + LAIC + SOIREE},
    {names: ['Phillipe Roure', 'Magda Roure'], habilitation: MAIRIE + LAIC},
    {names: ['Rida Pagatele'], habilitation: MAIRIE + LAIC},
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
    const normalizedReverse = normalizeInput(login?.split(' ')?.reverse()?.join('') ?? '')
    const logins = [normalizedLogin, normalizedReverse]
    return validLogins.find(user => user.names.map(normalizeInput).find(it => logins.includes(it)));
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

    if (!user) {
        signOut();
        if (!!login)
            alertError('Authentification');
        return
    }

    $('#login-page').css('display', 'none')
    $('#page').css('display', 'block').addClass('animated-fast fadeInUpMenu')
    $('#navbar').css('display', 'block').addClass('animated-fast fadeInUpMenu')
    // User is authenticated, show the page and store login in cookie
    setCookie(login);
    currentUser = user;
    // Destroy elements that are only for the evening
    if (!isInvitedTo(user.habilitation, SOIREE)) {
        $('.evening-element').remove();
    }
    $('#accompagnement').val(user.names.join('\n'))
    populateGallery();
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
    link.href = `assets/wedding/plannings/guide_${isInvitedTo(currentUser.habilitation, SOIREE) ? 1 : 2}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Remove the link after clicking
}

function populateGallery() {
    const gallery = $('#gallery')

    gallery.empty()

    const topPhotoIndex = Math.floor(Math.random() * NB_PHOTO) + 1;

    let translationXRange
    let translationYRange
    Object.keys(TRANSLATIONS).forEach((media) => {
        if (window.matchMedia(media).matches) {
            translationXRange = TRANSLATIONS[media].x
            translationYRange = TRANSLATIONS[media].y
        }
    })

    for (let i = 1; i <= NB_PHOTO; i++) {
        const colDiv = $('<div>')
            .addClass('photo-container')
            .click(() => openCarousel(i));
        // Create the img element with a placeholder or dynamic source
        const img = $('<img>')
            .attr('src', `assets/wedding/images/gallery/${i}.jpg`)
            .attr('alt', `Image ${i}`)
            .addClass('img-fluid')

        let finalAngle = 0
        let zIndex = 1000
        let translateX = 0
        let translateY = 0
        if (i !== topPhotoIndex) {
            const step = (ROTATION_RANGE * 2) / (NB_PHOTO - 1); // Calculate step size
            const baseAngle = -ROTATION_RANGE + (i - 2) * step; // Calculate base angle
            const noise = (Math.random() * NOISE_RANGE * 2) - NOISE_RANGE; // Add random noise ±2-4°

            translateX = (Math.random() * translationXRange * 2) - translationXRange; // ±20px
            translateY = (Math.random() * translationYRange * 2) - translationYRange; // ±20px

            finalAngle = baseAngle + noise;
            zIndex -= (2 * i)
        }
        colDiv.css({transform: `rotate(${finalAngle}deg) translate(${translateX}px, ${translateY}px)`, zIndex});

        const overlayDiv = $('<div>').addClass('photo-overlay');


        // Append the image to the column div, then the div to the gallery
        colDiv.append(img);
        colDiv.append(overlayDiv)
        gallery.append(colDiv);
    }
}

function openCarousel(index) {
    let images = ""
    for (let i = 1; i <= NB_PHOTO; i++) {
        images += `<div class="carousel-item ${i === index ? 'active' : ''}">`
        images += `<img src="assets/wedding/images/gallery/${i}.jpg" class="d-block w-100" ">`
        images += `</div>`
    }

    // Create modal HTML
    const modalHtml = `
            <div class="modal fade" id="imageCarouselModal" tabindex="-1" aria-labelledby="carouselModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-body p-0">
                            <div id="carouselExample" class="carousel slide" data-ride="carousel">
                                <div class="carousel-inner">
                                   ${images}
                                </div>
                                <!-- Carousel Controls -->
                                <a class="carousel-control-prev" onclick="$('#carouselExample').carousel('prev')" role="button" data-slide="prev">
                                    <i class="fa fa-chevron-left terracotta"></i>
                                </a>
                                <a class="carousel-control-next" onclick="$('#carouselExample').carousel('next')" role="button" data-slide="next">
                                    <i class="fa fa-chevron-right terracotta"></i>
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

    const {
        email,
        mairie,
        ceremonie,
        soiree,
        allergies,
        accompagnement,
        questions
    } = Object.fromEntries(new FormData(document.getElementById('saveDateForm')));

    // Check if the email format is valid
    if (!email || !$('#email')[0].checkValidity()) {
        Swal.fire({
            icon: email ? 'error' : 'warning',
            title: email ? 'Email invalide' : 'Champ requis',
            text: email ? 'Veuillez saisir une adresse email valide!' : 'Veuillez renseigner un email svp!',
            confirmButtonText: 'OK'
        });
        return;
    }

    const names = currentUser.names.join(', ');
    const subject = `RSVP de ${names}`;
    const body = `RSVP de ${names} 
      
      Email: ${email}
      
      Attending the town hall : ${mairie ? 'Yes' : 'No'}
      Attending the ceremony: ${ceremonie ? 'Yes' : 'No'}
      Attending the party: ${soiree ? 'Yes' : 'No'}
      
      Food allergies: 
      ${allergies || 'None'}
      
      Person(s) in the group : 
      ${accompagnement || 'None'}
      
      Questions:
       ${questions || 'None'}
      
      Thank you!
    `


    RSVP_RECIPIENTS.forEach(to => {
        fetch(`https://script.google.com/macros/s/${SCRIPT_ID}/exec`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'no-cors',
            body: JSON.stringify({to, subject, body,}),
        })
            .then(result => {
                Swal.fire({
                    icon: 'success',
                    title: 'Merci!',
                    text: 'Votre réponse a été envoyé avec succès!',
                    confirmButtonText: 'Super'
                });
                const form = $('#save-date-form')
                form.empty()
                form.addClass('row text-center')
                form.append($('p').append('Si vous avez oublié quoi que ce soit, vous pouvez directement nous contacter.'))
            })
            .catch(error => alertError('Soumission du Formulaire'))
    })
}

function alertError(title) {
    Swal.fire({
        icon: 'error',
        title,
        text: `Une erreur s'est produite, si elle persiste veuillez contacter votre administrateur. \n marc.wadjahdi@gmail.com`,
        confirmButtonText: 'OK',
    });
}