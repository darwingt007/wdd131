document.getElementById("currentYear").textContent = new Date().getFullYear();

document.getElementById("lastModified").textContent = "last Updated: " + document.lastModified;

const temperature = 21;
const windSpeed = 10;

function calculateWindChill(temp, speed) {
    return 13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965
}

function displayWindchill() {
    const windChillElement = document.getElementById("windChill");

    const validTemp = temperature <= 10;
    const validWind = windSpeed > 4.8;

    if (validTemp && validWind) {
        const wc = calculateWindChill(temperature, windSpeed);
        windChillElement.textContent = wc.toFixed(1) + "°C";
    } else {
        windChillElement.textContent = N/A
    }
}

displayWindchill();