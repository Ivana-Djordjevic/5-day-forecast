// #region
// AS A traveler
// I WANT to see the weather outlook for multiple cities
// SO THAT I can plan a trip accordingly
// ```

// ## Acceptance Criteria

// ```
// GIVEN a weather dashboard with form inputs
// WHEN I search for a city

// THEN I am presented with current [2========] and future conditions for that city

// AND that city is added to the search history

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
// #endregion

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast [1========]that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
//#region
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// #endregion

// #region
// Hello, welcome to my show
// Today we will start at the beginning, yes my assignment was to do the 5 day wearther forecast, but that doesn't mean, i can skip all the steps and just get there lolooolololollololololo
// okay so let's plan:

// for the 5 day forecast:

// we need the geotag api (fromthe same website) to convert the city to a longtitude and latitude

// so we need to invoke a function that will call upon the APIS to bestow their knowledge upon us
// ^_^ conditional: if no response, cry, then start over
// if data is received, conversion tiiiiime,
// then post it on instagram

//add more conditionals to enhance quality of life

//Tada!
// #endregion

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

    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q='${city}&appid=${myApiKey}`;

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
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=metric`;
    
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

//this function takes in data from getCurrentWeather for the current weather
function filterTodayWeatherData(weatherData){
    // console.log('must pinpoint which data points you want from the following list', weatherData)
}

var dayNumber = 0

function displayForecast(forecastData) { // i want the 12pm results from below
 console.log('should be the 4, 12, 20, 28, and 36 arrays', forecastData)
    let dateForcasted = forecastData.dt_txt.split(' ')[0]
    let weatherIcon = forecastData.weather[0].icon
    let temperature = forecastData.main.temp
    let windSpeed = forecastData.wind.speed
    let humidity = forecastData.main.humidity

    const daySection = document.querySelectorAll('.days'); //? how do i make them specific without being repetitive

    const dayOneSection = daySection[dayNumber]
    var dayEl = document.createElement('li');
    dayEl.setAttribute('style', 'list-style:none;');

    dayEl.innerText = dateForcasted;

    dayOneSection.appendChild(dayEl);

    var dayEl = document.createElement('img');
    dayEl.setAttribute('style', 'list-style:none;');

    dayEl.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

    dayOneSection.appendChild(dayEl);

    var dayEl = document.createElement('li');
    dayEl.setAttribute('style', 'list-style:none;');

    dayEl.innerText = temperature + '*C';

    dayOneSection.appendChild(dayEl);

    var dayEl = document.createElement('li');
    dayEl.setAttribute('style', 'list-style:none;');

    dayEl.innerText = windSpeed + 'm/h';

    dayOneSection.appendChild(dayEl);

    var dayEl = document.createElement('li');
    dayEl.setAttribute('style', 'list-style:none;');

    dayEl.innerText = humidity + '%';

    dayOneSection.appendChild(dayEl);



    
    //////////////
 dayNumber++;
//    daySection.forEach(fo÷recastData => { 

//     for (let i=0; i < forecastData.length; i++) {
//         daySection.appendChild.dayEl
//     }
//     // 
//    });




}

//this data is an array of 40 weather objects received by getForecast
function filterForecastData(forecastData){
    // console.log('under the display forecast function', forecastData)
    let startIndex;
// #region

        //dt._txt is currently an array, but we want to get a number value .: 
        // after splitting you get an array with the date and time seperated
        // call for index one because that's where the time number is, [0] is the date -- back in string form here
        // to get first two characters from a string use slice(0,2)
        // so then the i of startindex will be the days at 12pm   
        // increment by 8 to get the next day at 12pm
// #endregion
console.log(forecastData)    
for (let i=0; i < forecastData.length; i++){

        if (forecastData[i].dt_txt.split(' ')[1].slice(0,2) === '12'){
            startIndex = i
            console.log(startIndex)
            break  // if return, it goes to array 36 because that's the last 12pm
        }
    }
        console.log(startIndex)
    for (let i = startIndex; i < forecastData.length; i+=8){
        console.log('forecast data received', forecastData[i])   // why is it not working anymore
        
        displayForecast(forecastData[i]); // should only display the ones at 12pm 
    }
}

function getForecastData(lat, lon) {

    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=metric`;

    fetch(weatherUrl)
        .then(function (response) {
        //   console.log(response);
        if (!response.ok) {
            // console.log('foerecast fetch response is not ok');
            throw response.json();
        }
        //   console.log('forecast API fetched successfully');
        return response.json();
        })
        .then(function (forecastData) {
            // console.log('forecast data:', forecastData)
            filterForecastData(forecastData.list)
            // since it was an object, we selected the list key, so that he display function can choose from arrays 
            });
}

fetchGeoInfo('Sacramento');

// loadStorage()