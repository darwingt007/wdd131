// Display current year and last modified date
document.querySelector("#currentYear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = `Last updated: ${document.lastModified}`;

// Hamburger menu toggle
const mainnav = document.querySelector(".navigation");
const menuButton = document.querySelector("#menu");

menuButton.addEventListener("click", () => {
    mainnav.classList.toggle("show");
    menuButton.textContent = mainnav.classList.contains("show") ? "✖" : "☰";
});
