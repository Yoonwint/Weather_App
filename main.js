// Variable
const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-button");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".weather-info");
const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateTxt = document.querySelector(".current-date-txt");
const forecastItemsContainer = document.querySelector(".forecast-items-container");


const apiKey = "829863faaf8355034126d97b4aa0b997";




// EventListener
searchBtn.addEventListener("click", inputValue);
cityInput.addEventListener("keydown", checkInput)


// function
function inputValue() {
    if (cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    }

}

function checkInput(e) {
    if (e.key === "Enter" &&
        cityInput.value.trim() != ""
    ) {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    }
}



async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const respone = await fetch(apiUrl);
    return respone.json();
}



function getWeatherId(id) {
    if (id <= 232) {
        return "thunderstorm.svg";
    } else if (id <= 321) {
        return "drizzle.svg";
    } else if (id <= 531) {
        return "rain.svg";
    } else if (id <= 622) {
        return "snow.svg";
    } else if (id <= 781) {
        return "atmosphere.svg";
    } else if (id <= 800) {
        return "clear.svg";
    } else {
        return "clouds.svg";
    }

}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: "short",
        day: "2-digit",
        month: "short"
    }

    return currentDate.toLocaleDateString("en-GB", options);
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData("weather", city);
    if (weatherData.cod != 200) {
        showDisplaySections(notFoundSection);
        return
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + " °C";
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + "%";
    windValueTxt.textContent = speed + " M/s";
    currentDateTxt.textContent = getCurrentDate();

    weatherSummaryImg.src = `./assets/weather/${getWeatherId(id)}`;

    await updateForecastsInfo(city);
    showDisplaySections(weatherInfoSection);
}

async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData("forecast", city);
    const timeTaken = "12:00:00";
    const todayDate = new Date().toISOString().split("T")[0];
    
    forecastItemsContainer.innerHTML = '';
    forecastsData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken)
            && !forecastWeather.dt_txt.includes(todayDate)
        ) {
            updateForecastItems(forecastWeather);
        }
        

    })
}

function updateForecastItems(weatherData) {
    console.log(weatherData);
    const {
        dt_txt: date ,
        weather: [{ id }],
        main: { temp }
    } = weatherData;

    const dateTaken = new Date(date);
    const dateOption = {
        day: "2-digit",
        month: "short"
    };

    const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);
    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="./assets/weather/${getWeatherId(id)}" alt="ThundarStorm" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    
    `;
    
    forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
 

}

function showDisplaySections(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = "none");
    section.style.display = "flex";
}