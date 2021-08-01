function smoothScrollToElement(element) {

    document.querySelector(element).scrollIntoView({
        behavior: 'smooth'
    });

}

function initLoadingScreen() {
    $(".loader-wrapper").fadeOut("slow");
}

module.exports = {
    smoothScrollToElement, initLoadingScreen
}