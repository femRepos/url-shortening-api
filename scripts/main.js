const button = document.querySelector("#submit");
const input = document.querySelector("#input-url");
const copyButtons = document.querySelectorAll("result .btn");
const form = document.querySelector("form");

const baseURL = "https://api.shrtco.de/v2/shorten?url=";
let links = JSON.parse(localStorage.getItem("links")) || [];

document.querySelector(".burger").addEventListener("click", toggleNav);
form.addEventListener("submit", (e) => e.preventDefault());

document.addEventListener("DOMContentLoaded", (e) => {
	// make sure there are no more than 3 links
	tidyLinks();

	// update webpage to match database (local storage on reloads)
	links.forEach(([original, short]) => {
		createNewLinkElement(original, short);
	});
});

input.addEventListener("keyup", (e) => {
	if (form.classList.contains("error") && input.value)
		form.classList.remove("error");
});

button.addEventListener("click", (e) => {
	e.preventDefault();

	if (input.value) {
		if (form.classList.contains("error")) form.classList.remove("error");
		showNewURL();
	} else {
		showFormError();
	}
});

async function getNewURL(url) {
	try {
		let response = await fetch(baseURL + url);
		let data = await response.json();
		return data.result;
	} catch (e) {
		console.log(e);
		showFormError();
	}
}

async function showNewURL() {
	let res = await getNewURL(input.value);
	let originalLink = res.original_link;
	let shortLink = res.full_short_link;
	input.value = "";

	// store in makeshift database (localstorage)
	links.push([originalLink, shortLink]);

	localStorage.setItem("links", JSON.stringify(links));

	createNewLinkElement(originalLink, shortLink);
}

function createNewLinkElement(originalLink, newLink) {
	// create elements
	let container = document.querySelector(".results");
	let result = document.createElement("div");
	let resultInput = document.createElement("p");
	let resultOutput = document.createElement("div");
	let resultLink = document.createElement("p");
	let btn = document.createElement("button");

	// add attributes
	result.classList.add("result");
	resultInput.classList.add("result__input");
	resultOutput.classList.add("result__output");
	resultLink.classList.add("result__link");
	btn.classList.add("btn", "btn--small", "btn--square");

	// add content
	resultInput.textContent = originalLink;
	resultLink.textContent = newLink;
	btn.textContent = "Copy";

	// append elements
	container.appendChild(result);
	result.appendChild(resultInput);
	result.appendChild(resultOutput);
	resultOutput.appendChild(resultLink);
	resultOutput.appendChild(btn);

	// add button functionality
	btn.addEventListener("click", (e) => {
		let url =
			e.target.parentNode.querySelector(".result__link").textContent;

		// copy to clipboard
		navigator.clipboard.writeText(url);

		//add alt class for an amount of time
		btn.classList.add("btn--alt");
		btn.textContent = "Copied!";
		setTimeout(() => {
			btn.classList.remove("btn--alt");
			btn.textContent = "Copy";
		}, 5000);
	});
}

function toggleNav() {
	const nav = document.querySelector("nav");
	nav.classList.toggle("visible");
}

function showFormError() {
	if (!form.classList.contains("error")) form.classList.add("error");
}

function tidyLinks() {
	// tidy up the webpage
	let limit = 3;
	if (links.length > limit) links.splice(0, links.length - limit);
}
