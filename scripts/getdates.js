const currentDate = new Date();

const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

const lastModifiedElement = document.getElementById("lastModified");
lastModifiedElement.textContent = `Last updated: ${formattedDate}`;