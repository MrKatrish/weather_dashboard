// Global variables
const apiKey = 'dea958ca793d7639b784b973c04d7c27'; 


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

        function updateUI(weatherData) {
            // Update current weather
            const currentWeather = weatherData.list[0]; // Assuming the first item is the current weather
            const todayContainer = document.getElementById('today');
            todayContainer.innerHTML = `
                <h2>Current Weather in ${weatherData.city.name}</h2>
                <p>Date: ${new Date(currentWeather.dt * 1000).toLocaleDateString()}</p>
                <p>Temperature: ${currentWeather.main.temp}°C</p>
                <p>Humidity: ${currentWeather.main.humidity}%</p>
                <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
                <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png" alt="Weather icon">
            `;
        
            // Update 5-day forecast
            const forecastContainer = document.getElementById('forecast');
            forecastContainer.innerHTML = '<h2>5-Day Forecast</h2>';
            weatherData.list.forEach((forecast, index) => {
                if (index % 8 === 0) { // Assuming a new forecast every 8 items (3-hour intervals)
                    forecastContainer.innerHTML += `
                        <div class="forecast-item">
                            <p>Date: ${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                            <p>Temperature: ${forecast.main.temp}°C</p>
                            <p>Humidity: ${forecast.main.humidity}%</p>
                            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon">
                        </div>
                    `;
                }
            });
        }
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
