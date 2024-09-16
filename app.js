// Initialize the app
document.getElementById('search-btn').addEventListener('click', getWeather);

// Function to get weather based on user input
async function getWeather() {
    const city = document.getElementById('city-input').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    const apiKey = "f9ead19b74d34f70a87173731241509"

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
    const urlExtended = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=no`

    try {
        const response = await fetch(url);
        const extendedResponce = await fetch(urlExtended)
        const data = await response.json();
        const extendedData = await extendedResponce.json();
        if (data.cod === '404') {
            alert('City not found');
            return;
        }

        displayWeather(data);  // This function will display the weather on the UI
        displayExtendedForecast(extendedData.forecast); // This function will display the forcast on the UI
    } catch (error) {
        alert('Error fetching weather data. Please try again.');
    }
}

// Function to display weather info
function displayWeather(data) {

    const weatherContainer = document.getElementById('weather-info');
    const iconUrl = `https:${data.current.condition.icon}`

    weatherContainer.innerHTML = `
        <div class="w-8/12 lg:w-8/12">
        <h2 class="text-lg md:text-2xl lg:text-3xl font-bold m-4">${data.location.name} (${data.location.localtime.split(" ")[0]})</h2>
        <p class="lg:font-semibold md:font-semibold mx-4 my-2">Temperature: ${data.current.temp_c}°C</p>
        <p class="lg:font-semibold md:font-semibold mx-4 my-2">Wind Speed: ${data.current.wind_mph} m/s</p>
        <p class="lg:font-semibold md:font-semibold mx-4 my-2">Humidity: ${data.current.humidity}%</p>
        </div>
        <div class="w-4/12 h-full flex flex-col items-center justify-between p-10">
        <img src="${iconUrl}" alt="Weather icon" border="0" >
        <p class="font-semibold">${data.current.condition.text}</p>
        </div>
    `;
}

navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiKey = `f9ead19b74d34f70a87173731241509`
    console.log("Lat&long", lat, lon)

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;
    const urlExtended = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5&aqi=no&alerts=no`

    const response = await fetch(url);
    const extendedResponce = await fetch(urlExtended)
   
    const data = await response.json();
    const extendedData = await extendedResponce.json();

    displayWeather(data);  // This function will display the weather on the UI
    displayExtendedForecast(extendedData.forecast);  // This function will display the forcast on the UI
});

// Function to fetch weather data based on latitude and longitude
const fetchWeatherByLocation = async (latitude, longitude) => {
    try {
        const apiKey = `f9ead19b74d34f70a87173731241509`
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`);
        const extendedResponce = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=5&aqi=no&alerts=no`)
        const data = await response.json();
        const extendedData = await extendedResponce.json();
        displayWeather(data);  // This function will display the weather on the UI
        displayExtendedForecast(extendedData.forecast);  // This function will display the forcast on the UI
    } catch (error) {
        console.error('Error:', error.message);
        alert('Failed to retrieve weather data.');
    }
};

// Get the user's current location and fetch weather data for that location
const getCurrentLocationWeather = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByLocation(latitude, longitude);
        }, (error) => {
            alert('Unable to retrieve your location');
            console.error('Geolocation error:', error);
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
};

// Example usage: call getWeather when the user clicks the "Use Current Location" button
document.getElementById('useLocationBtn').addEventListener('click', getCurrentLocationWeather);

let cities = JSON.parse(localStorage.getItem('cities')) || [];

function saveCity(city) {
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
    }
}

// Function to display forcast info
function displayExtendedForecast(data) {
    console.log("data", data.forecastday)
    const forecastContainer = document.getElementById('forecast-info');
    forecastContainer.innerHTML = data.forecastday.map(forcast => `
     <div class="w-fit bg-gray-300 m-5 p-4 rounded-2xl flex flex-col items-center justify-between">
                <h4 class="text-xl font-bold m-4">${new Date(forcast.date).toDateString()}</h4>
                <p class="font-semibold text-blue-800">${forcast.day.condition.text}</p>
                <img src="${forcast.day.condition.icon}" alt="Weather icon">
                <p class="font-semibold mt-1">Temp: ${forcast.day.avgtemp_c}°C</p>
                <p class="font-semibold mt-1">Wind: ${forcast.day.maxwind_kph} kph</p>
                <p class="font-semibold mt-1">Humidity: ${forcast.day.avghumidity}%</p>
            </div>
    `).join('');
}