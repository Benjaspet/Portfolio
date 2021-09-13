function initScrollbar() {
    document.addEventListener("DOMContentLoaded", function() {
        OverlayScrollbars(document.querySelectorAll("body"), {className: "os-theme-light"})
    });
}