// document.onload = function () {
// }


document.onscroll = (function () {
    scroll();
});
document.onload = (function () {
    scroll();
});

function scroll() {
    var header = document.getElementById("header");
    var content = document.getElementById("content");
    
    if (header && content) {
        var navbar = content.querySelector('.navbar');
        if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
            header.style.height = "0";
            content.style.marginTop = "0";
            navbar.classList.remove('gray');
            navbar.classList.add('primary','fixed');
        } else {
            header.style.height = "30vh";
            content.style.marginTop = "30vh";
            navbar.classList.remove('primary','fixed');
            navbar.classList.add('gray');
        }
    }
}