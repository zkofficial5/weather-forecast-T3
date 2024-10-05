document.getElementById('search-btn').addEventListener('click', fetchWeather);

function fetchWeather() {
    const location = document.getElementById('location-input').value;
    const apiKey = 'f96482aabd7c6771e22b4705103765a0'; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

    // fetching the current weather
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                document.getElementById('location').innerText = data.name;
                document.getElementById('date').innerText = new Date().toLocaleDateString();
                document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
                document.getElementById('description').innerText = data.weather[0].description;
                document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
                document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} m/s`;
                document.getElementById('pressure').innerText = `Pressure: ${data.main.pressure} hPa`;
                document.getElementById('sunrise-sunset').innerHTML = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}<br>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;

                const iconCode = data.weather[0].icon;
                document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
            } else {
                alert('Location not found, please try again.');
            }
        })
        .catch(() => {
            alert('An error occurred, please try again.');
        });

    // for fetching the five day forecast
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                const weeklyForecast = document.querySelector('.weekly-forecast');
                weeklyForecast.innerHTML = ''; 

                // process five day forecast data (i meam getting one forecast per day)
                const daysData = data.list.filter(item => item.dt_txt.includes('12:00:00'));

                daysData.forEach(day => {
                    const dayElement = document.createElement('div');
                    dayElement.classList.add('day-forecast');

                    const date = new Date(day.dt * 1000);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

                    const iconCode = day.weather[0].icon;
                    const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

                    dayElement.innerHTML = `
                        <p>${dayName}</p>
                        <img src="${iconUrl}" alt="Weather Icon">
                        <p>${Math.round(day.main.temp)}°C</p>
                    `;
                    weeklyForecast.appendChild(dayElement);
                });
            } else {
                alert('Forecast not found, please try again.');
            }
        })
        .catch(() => {
            alert('An error occurred while fetching the forecast, please try again.');
        });
}
