async function getWeather() {
    const city = document.getElementById("city").value;
    const apiKey = "df7dcacdc4ca9073762c2b558f681943";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "404") {
        document.getElementById("weatherResult").innerHTML = "City not found!";
        return;
    }

    document.getElementById("weatherResult").innerHTML = `
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Condition: ${data.weather[0].description}</p>
    `;
}
