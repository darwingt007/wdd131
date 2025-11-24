
document.querySelector("#currentYear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = `Last updated: ${document.lastModified}`;


const mainnav = document.querySelector(".navigation");
const menuButton = document.querySelector("#menu");

menuButton.addEventListener("click", () => {
    mainnav.classList.toggle("show");
    menuButton.textContent = mainnav.classList.contains("show") ? "✖" : "☰";
});

// Temple Data
const temples = [
    {
        templeName: "Aba Nigeria",
        location: "Aba, Nigeria",
        dedicated: "2005, August, 7",
        area: 11500,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
    },
    {
        templeName: "Manti Utah",
        location: "Manti, Utah, USA",
        dedicated: "1888, May, 21",
        area: 74792,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
    },
    {
        templeName: "Payson Utah",
        location: "Payson, Utah, USA",
        dedicated: "2015, June, 7",
        area: 96630,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
    },
    {
        templeName: "Yigo Guam",
        location: "Yigo, Guam",
        dedicated: "2020, May, 2",
        area: 6861,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
    },
    {
        templeName: "Washington D.C.",
        location: "Kensington, Maryland, USA",
        dedicated: "1974, November, 19",
        area: 156558,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
    },
    {
        templeName: "Lima Perú",
        location: "Lima, Perú",
        dedicated: "1986, January, 10",
        area: 9600,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
    },
    {
        templeName: "Mexico City Mexico",
        location: "Mexico City, Mexico",
        dedicated: "1983, December, 2",
        area: 116642,
        imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
    },

    // Three additional temples
    {
        templeName: "Bangkok Thailand",
        location: "Bangkok, Thailand",
        dedicated: "2023, October, 22",
        area: 48100,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/bangkok-thailand-temple/bangkok-thailand-temple-40037-main.jpg"
    },
    {
        templeName: "Salt Lake Temple",
        location: "Salt Lake City, Utah, USA",
        dedicated: "1893, April, 6",
        area: 253015,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/salt-lake-temple/salt-lake-temple-15669-main.jpg"
    },
    {
        templeName: "Cochabamba Bolivia",
        location: "Cochabamba, Bolivia",
        dedicated: "2000, April, 30",
        area: 35000,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/cochabamba-bolivia-temple/cochabamba-bolivia-temple-13721-main.jpg"
    }
];

// cards created to display

function displayTemples(list) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    list.forEach(temple => {
        const card = document.createElement("figure");

        card.innerHTML = `
            <img src="${temple.imageUrl}" 
                 alt="${temple.templeName} Temple" 
                 loading="lazy">
            <figcaption>
                <h3>${temple.templeName}</h3>
                <p><strong>Location:</strong> ${temple.location}</p>
                <p><strong>Dedicated:</strong> ${temple.dedicated}</p>
                <p><strong>Size:</strong> ${temple.area} sq ft</p>
            </figcaption>
        `;

        gallery.appendChild(card);
    });
}

displayTemples(temples);

// Filters section as requested 
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const filter = link.dataset.filter;

        let filtered = temples;

        if (filter === "old") {
            filtered = temples.filter(t => parseInt(t.dedicated) < 1900);
        }
        if (filter === "new") {
            filtered = temples.filter(t => parseInt(t.dedicated) > 2000);
        }
        if (filter === "large") {
            filtered = temples.filter(t => t.area > 90000);
        }
        if (filter === "small") {
            filtered = temples.filter(t => t.area < 10000);
        }

        displayTemples(filtered);
    });
});
