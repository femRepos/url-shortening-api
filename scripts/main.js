const burger = document.querySelector(".burger");
const nav = document.querySelector("nav");

burger.addEventListener("click", toggleNav);

function toggleNav() {
	nav.classList.toggle("visible");
}
