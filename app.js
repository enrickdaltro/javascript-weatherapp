// setting the api key
const key = '8b0e6f9174ef31f1deb5cc7079944b44';

// kelvin const to make convertion
const KELVIN = 273;

// select ui vars
const notificationElement = document.querySelector('.notification');
const iconElement = document.querySelector('.weather-icon');
const temperatureElement = document.querySelector('.temperature-value p');
const descriptionElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');

// set data
const weather = {
    temperature: {
        value: 18,
        unit: 'celsius'
    },
    description: 'cloudy',
    iconId: '01d',
    city: 'London',
    country: 'GB'
};

function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    // fetch api
    fetch(api)
        .then(function(response) {
            let data = response.json();
            return data;
        })
        .then(function(data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function() {
            displayWeather();
        });
}

// store latitude and longitude
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

// show error in case of the browser doesn't support location
function showError(error) {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

// to display weather, we'll need to change every element of the HTML, using innerHTML
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" />`;

    temperatureElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;

    descriptionElement.innerHTML = weather.description;

    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// convert celsius to Fahrenheit
function celsiusToFahrenheit(temperature) {
    return (temperature * 9) / 5 + 32;
}

// temperature conversion
temperatureElement.addEventListener('click', () => {
    if (weather.temperature.value === undefined) return;
    if (weather.temperature.unit === 'celsius') {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        temperatureElement.innerHTML = `${fahrenheit}° <span>F</span>`;
        weather.temperature.unit = 'fahrenheit';
    } else {
        temperatureElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
        weather.temperature.unit = 'celsius';
    }
});

// get users location
if ('geolocation' in navigator) {
    // we want to call getCurrentPosition method
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML =
        "<p>Browser doesn't support Geolocation.</p>";
}
