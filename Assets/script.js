

const myApiKey = '0fffcdb9d9732daced94e2c5d89e2a50';
const cityInputValue = document.getElementById('city-form');

cityInputValue.addEventListener('submit', citySearch);

// function saveToStorage(newCity){
//     const history = JSON.parse(localStorage.getItem('history'))
//     history.push(newCity)
//     //keep your datatype in mind for how you want to save your city
//     localStorage.setItem('history', JSON.stringify(history))
// }

// function loadStorage(){
//     const history = JSON.parse(localStorage.getItem('history'))
//     if(!history){
//         localStorage.setItem('history', JSON.stringify([]))
//     }
// }

function citySearch(event) {
    event.preventDefault();

    const inputBox = document.getElementById('input');

    if (!inputBox.value) {
        return;
    }

    let city = inputBox.value.trim();
    console.log('city searched:', city);

    fetchGeoInfo(city);
}

function fetchGeoInfo(city) {

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q='${city}&appid=${myApiKey}`;

    fetch(geoUrl)
        .then(function (response) {
        // console.log('then geo', response);

            if (!response.ok) {
                // console.log('fetch response is not ok');
                throw response.json();
            }
            // console.log('it fetched successfully');
            return response.json();
            })

        .then(function (geoData) {
        // console.log('this is what was recevied from the geocall', geoData);
        //save to storage here
        //(cuz valid city searched confirmed)
        getCurrentWeather(geoData[0].lat, geoData[0].lon);
        getForecastData(geoData[0].lat, geoData[0].lon);
        });
}

function getCurrentWeather(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=metric`;
    
    fetch(weatherUrl)
    .then(function (response) {
        // console.log('weather call response: ', response);
        if (!response.ok) {
        // console.log('weather fetch response is not ok');
        throw response.json();
      }
        // console.log('weather fetched successfully');
        return response.json();
    })
    .then(function (weatherData) {
        filterTodayWeatherData(weatherData)
        // console.log('data from getCurrentWeather', weatherData)
    });
}

function filterTodayWeatherData(weatherData){
    // console.log('must pinpoint which data points you want from the following list', weatherData)
}

let dayNumber = 0

function displayForecast(forecastData) { 
//  console.log('should be the 4, 12, 20, 28, and 36 arrays', forecastData)
    let dateForcasted = forecastData.dt_txt.split(' ')[0]
    let weatherIcon = forecastData.weather[0].icon
    let temperature = forecastData.main.temp
    let windSpeed = forecastData.wind.speed
    let humidity = forecastData.main.humidity

    const daySection = document.querySelectorAll('.days');
    const dayOneSection = daySection[dayNumber]
    
    var dayEl = document.createElement('li');
    dayEl.setAttribute('style', 'list-style:none;');
    dayEl.innerText = dateForcasted;
    dayOneSection.appendChild(dayEl);

    var dayEl = document.createElement('img');
    dayEl.setAttribute('style', 'background-color: rgb(148, 148, 212);border-radius: 20px;');
    dayEl.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
    dayOneSection.appendChild(dayEl);

    var dayEl = document.createElement('li');
    dayEl.setAttribute('style', 'list-style:none;');
    dayEl.innerText = temperature + ' ºC';
    dayOneSection.appendChild(dayEl);

    var dayEl = document.createElement('li');
    dayEl.setAttribute('style', 'list-style:none;');
    dayEl.innerText = windSpeed + ' meters/sec';
    dayOneSection.appendChild(dayEl);

    var dayEl = document.createElement('li');
    dayEl.setAttribute('style', 'list-style:none;');
    dayEl.innerText = 'humidity ' + humidity + ' %';
    dayOneSection.appendChild(dayEl);

    dayNumber++;
}

//this data is an array of 40 weather objects received by getForecast
function filterForecastData(forecastData){
    let startIndex;
// #region
        //dt._txt is currently an array, but we want to get a number value .: 
        // after splitting you get an array with the date and time seperated
        // call for index one because that's where the time number is, [0] is the date -- back in string form here
        // to get first two characters from a string use slice(0,2)
        // so then the i of startindex will be the days at 12pm   
        // increment by 8 to get the next day at 12pm
// #endregion
    for (let i=0; i < forecastData.length; i++){

        if (forecastData[i].dt_txt.split(' ')[1].slice(0,2) === '12'){
            startIndex = i
            console.log(startIndex)
            break  // if return, it goes to array 36 because that's the last 12pm
        }
    }
    for (let i = startIndex; i < forecastData.length; i+=8){
        
        displayForecast(forecastData[i]); 
    }
}

function getForecastData(lat, lon) {

    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=metric`;

    fetch(weatherUrl)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
            })

        .then(function (forecastData) {
            filterForecastData(forecastData.list);
            });
}

// fetchGeoInfo('Sacramento');

// loadStorage()