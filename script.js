const myKey = '33647071b641e72c92b60ca3c9b19233';
const url = `https://api.openweathermap.org/data/2.5/weather?appid=${myKey}&units=metric`;
const urlForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=${myKey}&units=metric`;
const body = document.querySelector('body');
const array = [];
let forecastOpenedArray = [];

//building html elements
//--Header
const header = document.createElement('header');
body.appendChild(header);
const headerParagraph = document.createElement('p');
const headerText = document.createTextNode('Weather App');
const headerImg = document.createElement('img');
header.appendChild(headerParagraph);
headerParagraph.appendChild(headerText);
header.appendChild(headerImg);
headerImg.src = 'header-icon.png';
header.classList.add('header');

//--Input and Button
const inputAndButtonContainer = document.createElement('div');
body.appendChild(inputAndButtonContainer);
inputAndButtonContainer.classList.add('input-button-container');
const input = document.createElement('input');
inputAndButtonContainer.appendChild(input);
input.placeholder = 'enter city name';
const button = document.createElement('button');
inputAndButtonContainer.appendChild(button);
const buttonText = document.createTextNode('Submit');
button.appendChild(buttonText);

//--Search output container
const divMain = document.createElement('div');
body.appendChild(divMain);
divMain.classList.add('search-output-container');

//FUNCTIONS
//--to get city weather data
function getCityData(cityName) {
  return fetch(`${url}&q=${cityName}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })

    .then((json) => {
      if (typeof json === 'undefined') {
        myAlert();
      } else {
        if (array.indexOf(json.name) !== -1) {
          alert('This city already exists');
        } else {
          console.log(json);
          buildCityData(json);
          array.push(json.name);
        }
      }
    })

    .catch((error) => {
      console.log(error);
    });
}

//--to get city weather forecast

function getCityForecast(cityName) {
  return fetch(`${urlForecast}&q=${cityName}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })

    .then((json) => {
      fillForecast(json, cityName);
      console.log(json);
    })

    .catch((error) => {
      console.log(error);
    });
}

//--alert if city is not found

function myAlert() {
  alert('Your city is not found!');
}

//--build search result city html

function buildCityData(data) {
  let date = Date();
  let temperature = data.main.temp;
  let wind = data.wind.speed;

  divMain.insertAdjacentHTML(
    'afterbegin',
    `<div id="${data.name}" class ="search-data">
        <header>
            <p>${data.name}</p>
            <button class="exit-button" id="BT">
            <div></div>
            </button>
        </header>
        <div class = "search-data__temperature">
            <p>${temperature.toFixed(0)} &#176;</p>
            <img src= ${getMyWeatherIcons(data.weather[0].icon)}></img>
        </div>
        <h3>${data.weather[0].description}</h3>
        <table class ="search-data__humidity-wind">
            <tr>
            <td class= "yellow-border"><p>${
              data.main.humidity
            }% <img class="humidityIcon" src= "icons/humidity.png"></img></p></td>
            <td><p>${wind.toFixed(
              0
            )} <img class="windIcon" src= "icons/wind.png"></img></p></td>
            </tr>
        </table>
        <br>
        <h4>Retrieved on ${date}</h4>
        <div class="search-data__forecast">
            <button id="forecast-button${
              data.name
            }">3 days forecast <i class="fas fa-angle-double-down buttonDropdown"></i></button>
        </div>
        <div id="forecast-div${data.name}" class="forecast-div-class">
        </div>
    </div>`
  );

  //--delete city data output container event

  let deleteButton = document.getElementById(`BT`);

  deleteButton.addEventListener('click', (event) => {
    let indexRemoveFromArray = array.indexOf(data.name);
    event.target.parentNode.parentNode.parentNode.remove();
    array.splice(indexRemoveFromArray, 1);
    console.log(array);
  });

  //--get city forecast event

  let forecastButton = document.getElementById(`forecast-button${data.name}`);

  forecastButton.addEventListener('click', (event) => {
    if (forecastOpenedArray.indexOf(data.name) === -1) {
      getCityForecast(data.name);
      document.getElementById(
        `forecast-button${data.name}`
      ).innerHTML = `3 days forecast <i class="fas fa-angle-double-down buttonForecast"></i>`;
      forecastOpenedArray.push(data.name);
    } else {
      document.getElementById(`forecast-div${data.name}`).innerHTML = '';
      document.getElementById(
        `forecast-button${data.name}`
      ).innerHTML = `3 days forecast <i class="fas fa-angle-double-down buttonDropdown"></i>`;
      forecastOpenedArray.splice(forecastOpenedArray.indexOf(data.name), 1);
    }
  });
}

//--get city forecast function

function fillForecast(data, cityName) {
  document.getElementById(
    `forecast-div${cityName}`
  ).innerHTML = `<table class="forecast-table">
        <tr>
            <td><p>${getWeekDay(data.list[7].dt_txt)}</p></td>
            <td class ="tableTemperatureAndIcon"><p>${data.list[7].main.temp.toFixed(
              0
            )} &#176;</p><img src= ${getMyWeatherIcons(
    data.list[7].weather[0].icon
  )}></img></td>
        </tr>
        <tr class="secondTr">
            <td><p>${getWeekDay(data.list[15].dt_txt)}</p></td>
            <td class ="tableTemperatureAndIcon"><p>${data.list[15].main.temp.toFixed(
              0
            )} &#176;</p><img src= ${getMyWeatherIcons(
    data.list[15].weather[0].icon
  )}></img></td>
        </tr>
        <tr>
            <td><p>${getWeekDay(data.list[23].dt_txt)}</p></td>
            <td class ="tableTemperatureAndIcon"><p>${data.list[23].main.temp.toFixed(
              0
            )} &#176;</p><img src= ${getMyWeatherIcons(
    data.list[23].weather[0].icon
  )}></img></td>
        </tr>
    </table>`;
}

//--get weekday function

function getWeekDay(pDate) {
  let d = new Date(pDate);
  let weekday = new Array(7);
  weekday[0] = 'Sunday';
  weekday[1] = 'Monday';
  weekday[2] = 'Tuesday';
  weekday[3] = 'Wednesday';
  weekday[4] = 'Thursday';
  weekday[5] = 'Friday';
  weekday[6] = 'Saturday';
  return weekday[d.getDay()];
}

//--get icons function

function getMyWeatherIcons(oldPngCode) {
  let newIcon;
  switch (oldPngCode) {
    case '01d':
      return 'icons/DayClear.png';
    case '01n':
      return 'icons/NightClear.png';
    case '02d':
      return 'icons/DayMostlySunny.png';
    case '02n':
      return 'icons/NightMostlySunny.png';
    case '03d':
      return 'icons/DayMostlyCloudy.png';
    case '03n':
      return 'icons/NightMostlyCloudy.png';
    case '04d':
    case '04n':
      return 'icons/DayCloudy.png';
    case '09d':
    case '09n':
      return 'icons/DayRain.png';
    case '10d':
    case '10n':
      return 'icons/DayChanceOfRain.png';
    case '11d':
    case '11n':
      return 'icons/DayChanceOfStorms.png';
    case '13d':
    case '13n':
      return 'icons/DayChanceOfFlurries.png';
    case '50d':
    case '50n':
      return 'icons/DayFog.png';
    default:
      return 'icons/Day1.png';
  }
}

//EVENTS
//-- get city data on search submit button

button.addEventListener('click', (event) => {
  getCityData(input.value);
});

//--input event on enter key
input.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    input.select();
    button.click();
  }
});
