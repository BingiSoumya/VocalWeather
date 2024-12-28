const apiKey = "41bef1d1ddc74b3a74a8bc031d21e70d";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const voiceMessageBtn = document.querySelector(".voice-message-btn"); // Voice message button
const weathericon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h ";

        if (data.weather[0].main == "Clouds") {
            weathericon.src = "clouds.png";
        } else if (data.weather[0].main == "Clear") {
            weathericon.src = "clear.png";
        } else if (data.weather[0].main == "Rain") {
            weathericon.src = "rain.png";
        } else if (data.weather[0].main == "Drizzle") {
            weathericon.src = "drizzle.png";
        } else if (data.weather[0].main == "Mist") {
            weathericon.src = "mist.png";
        }

        // Show weather and hide error
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";

        // Call the function to speak the weather
        speakWeather(data.main.temp, data.weather[0].main, data.name);
    }
}

// Function to speak the weather condition and temperature
function speakWeather(temperature, condition, city) {
    const message = `The temperature is ${Math.round(temperature)}°C and it is ${condition.toLowerCase()} in ${city}.`;

    // Create a speech message
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US"; // Set the language to English
    speech.volume = 1; // Volume level (0 to 1)
    speech.rate = 1; // Speed of speech (0.1 to 10)
    speech.pitch = 1; // Pitch of speech (0 to 2)

    // Speak the message
    window.speechSynthesis.speak(speech);
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Add event listener to voice message button (if you still want to keep it for manual speech)
voiceMessageBtn.addEventListener("click", () => {
    const city = document.querySelector(".city").innerText;
    const temp = document.querySelector(".temp").innerText.replace("°c", "");
    const condition = document.querySelector(".weather-icon").alt || "clear"; // Default if no alt attribute

    speakWeather(temp, condition, city);
});
