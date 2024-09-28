const menu = {};
const NAV_CLS = 'small-nav';
const onWindowScroll = () => {
    const $header = $(".header:first");
    if(window.scrollY === 0) $header.removeClass(NAV_CLS);
    else $header.addClass(NAV_CLS);
}

window.onscroll = () => onWindowScroll();
