const COOKIE = 'azerwedding-login';

const MAIRIE = 1;   // 001
const LAIC = 2;     // 010
const SOIREE = 4;   // 100


// Function to check if invited to a specific event
function isInvitedTo(invitation, event) {
    return (invitation & event) !== 0; // Check if event bit is set
}

// Step 1: Declare valid logins
const validLogins = [
    {name: 'Marc WADJAHDI', habilitation: MAIRIE + LAIC + SOIREE},
    {name: 'Jade CORNET', habilitation: MAIRIE + LAIC + SOIREE},
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
var contentWayPoint = function () {
    $('.animate-box').waypoint(function (direction) {
        var box = this.element;
        if (direction !== 'down') return;
        if ($(box).hasClass('animated-fast')) return;
        $(box).addClass('item-animate');
        setTimeout(function () {
            $('body .animate-box.item-animate').each(function (k) {
                var el = $(this);
                setTimeout(function () {
                    var effect = el.data('animate-effect') ?? 'fadeInUp';
                    el.addClass(`${effect} animated-fast`);
                    el.removeClass('item-animate');
                }, k * 200, 'easeInOutExpo');
            });

        }, 100);
    }, {offset: '85%'});
};

function signIn(login) {
    let user = findUser(login);

    if (!user) return signOut();

    $('#login-page').css('display', 'none')
    $('#page').css('display', 'block').addClass('animated-fast fadeInUpMenu')
    $('#navbar').css('display', 'block').addClass('animated-fast fadeInUpMenu')
    // User is authenticated, show the page and store login in cookie
    setCookie(login);
    setTimeout(function (){
        contentWayPoint()
    }, 1000)
}

function signOut() {
    localStorage.removeItem(COOKIE)
    $('#login-page').css('display', 'block')
    $('#page').css('display', 'none').addClass('animated-fast fadeInUpMenu')
    $('#navbar').css('display', 'none').addClass('animated-fast fadeInUpMenu')
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