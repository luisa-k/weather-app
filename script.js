let currentDate;
let debug = false;
const dateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

document.getElementById("submit-city").addEventListener("click", onClick);
if (debug) {
  onClick();
}
const onClick = async () => {
  var inputValue = debug ? debug : document.getElementById("city").value;
  let validCity = false;
  currentDate = new Date();
  //Fetch the weather of today (right now)
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=955acaf99fc844f28513c2020912ecff`
  )
    .then((response) => response.json())
    .then((data) => {
      if (inputValue === "") {
        window.alert("Please put a city!");
        return;
      }
      if (data.cod === "404") {
        window.alert(data.message);
        return;
      }
      validCity = true;
      displayCurrentWeather(data);
    });
  if (validCity) {
    //Fetching the forecast after the main weather
    await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${inputValue}&units=metric&appid=955acaf99fc844f28513c2020912ecff`
    )
      .then((response) => response.json())
      .then((data) => displayForecast(data));
  }
};

const displayCurrentWeather = (data) => {
  // Creates the picture before adding the data
  const weatherPic = document.getElementById("current-weather-pic");
  weatherPic.innerHTML = "";
  const tempPic = document.createElement("img");
  tempPic.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherPic.append(tempPic);

  // Displaying current weather data besides picture
  const weatherDisplay = document.getElementById("current-weather-data");
  weatherDisplay.innerHTML = "";
  const dateToday = document.createElement("p");
  dateToday.innerText = `Today - ${currentDate.toLocaleString(
    "en-DE",
    dateOptions
  )}`;
  weatherDisplay.append(dateToday);
  const cityDisplay = document.createElement("p");
  cityDisplay.innerText = `City: ${data.name}`;
  weatherDisplay.append(cityDisplay);
  const cityTemp = document.createElement("p");
  cityTemp.innerText = `Current temperature: ${data.main.temp} °C`;
  weatherDisplay.append(cityTemp);
};

const displayForecast = (data) => {
  //console.log(data);
  const allForecastsContainer = document.querySelector("#forecast-container");
  allForecastsContainer.innerHTML = "";

  const forecastHeader = document.createElement("h2");
  forecastHeader.innerText = `5-Day 3-Hour Forecast`;
  allForecastsContainer.append(forecastHeader);

  const allForecasts = document.createElement("div");
  allForecasts.id = "all-forecasts";
  allForecastsContainer.append(allForecasts);

  let latestDate = 0;
  let todayDate = currentDate.getDate();
  for (var i = 0; i < data.list.length; i++) {
    const dataFullDate = new Date(data.list[i].dt_txt);
    const dataDate = dataFullDate.getDate();
    if (todayDate < dataDate) {
      //First entry on each forecast date
      if (latestDate < dataDate) {
        //Create all necessary elements for forecast
        const forecast = document.createElement("div");
        forecast.id = String("forecast" + dataDate);

        const forecastDate = document.createElement("div");
        forecastDate.classList.add("forecast-button");
        const forecastDay = document.createElement("div");
        forecastDay.classList.add(String("forecastDay"));
        forecastDay.id = String("forecastDay" + dataDate);
        forecastDate.innerText = `${dataFullDate.toLocaleString(
          "en-DE",
          dateOptions
        )}`;
        forecastDate.onclick = function () {
          if (forecastDay.style.display == "flex") {
            forecastDay.style.display = "none";
          } else {
            forecastDay.style.display = "flex";
            forecastDay.style.justifyContent = "center";
          }
        };

        allForecasts.append(forecast);
        forecast.append(forecastDate);
        forecast.append(forecastDay);

        //Create slider for forecast
        const forecastSlider = document.createElement("div");
        forecastSlider.id = String("forecastSlider" + dataDate);
        forecastSlider.classList.add(String("forecastSlider"));
        forecastDay.append(forecastSlider);

        latestDate = dataDate;
      }

      //General forecast entries creation
      const forecastSlider = document.getElementById(
        String("forecastSlider" + dataDate)
      );
      const forecastSlide = document.createElement("div");
      forecastSlide.id = String("forecastSlide" + dataDate);
      forecastSlide.classList.add(String("forecastSlide"));
      forecastSlider.append(forecastSlide);

      const slideHour = document.createElement("div");
      slideHour.classList.add("forecastSlideContent");
      slideHour.innerHTML = `${dataFullDate.getHours()}:00`;
      forecastSlide.append(slideHour);

      const slidePic = document.createElement("div");
      const image = document.createElement("img");
      slidePic.classList.add("forecastSlideContent");
      image.src = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
      slidePic.append(image);
      forecastSlide.append(slidePic);

      const slideTemp = document.createElement("div");
      slideTemp.classList.add("forecastSlideContent");
      slideTemp.innerText = `Temperature: ${data.list[i].main.temp_max} °C`;
      forecastSlide.append(slideTemp);
    }
  }
};
