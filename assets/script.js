// Global variables
const apiKey = '?'; 


// Function to get coordinates of a city
async function getCoordinates(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return { lat: data.coord.lat, lon: data.coord.lon };
    } catch (error) {
        console.error("Error fetching coordinates:", error);
    }
}

// Function to get weather data
async function getWeatherData(cityName) {
    const coords = await getCoordinates(cityName);
    if (!coords) return;

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`;
    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();
        updateUI(data); // Function to update the UI with fetched data
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// Event listener for the search button
document.getElementById('search-button').addEventListener('click', function(event) {
    event.preventDefault();
    const cityName = document.getElementById('search-input').value;
    getWeatherData(cityName);
    updateHistory(cityName); // Function to update the search history
});
