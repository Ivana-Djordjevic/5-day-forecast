

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

const myApiKey = '0fffcdb9d9732daced94e2c5d89e2a50';

$().ready(function(){
    const cityInputValue = document.getElementById('city-form');

    cityInputValue.addEventListener('submit', onCitySearch);
})

async function onCitySearch(event) { 
    event.preventDefault();
    const cityName = getCityInputValue();
    const coordinates = await fetchCityCoordinates(cityName);
    const ForecastData = await fetchForecast(coordinates);
}

function getCityInputValue() {

    const cityInputValue = $('input').val().trim();
    
    if (!cityInputValue) {
        throw new Error('No input.');
    }
    return cityInputValue;
}

function fetchCityCoordinates(cityInputValue) {

    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q='${cityInputValue}&appid=${myApiKey}`;
    const geoResponsePromise = fetch(geoUrl);
    const geoDataPromise = geoResponsePromise.then(function (response) {

            if (!response.ok) {
                throw response.json(); //why not throw error? is the response at this point already considered to be the error?
            }
            console.log(response); // where you at my bro
            return response.json();
        })

    const coordinatesPromise = geoDataPromise.then(function (json) {
        // console.log(json);
        return {
            lat: json[0].lat,
            lon: json[0].lon,
        }
    })
    return coordinatesPromise;
}

function fetchForecast(coordinates) { 
    const lat = coordinates.lat;
    const lon = coordinates.lon;

    const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=metric`;

    const forecastResponsePromise = fetch(weatherUrl);
    const forecastDataPromise = forecastResponsePromise.then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
    const forecastPromise = forecastDataPromise.then(filterForecastData);
    return forecastPromise; //?
}

function filterForecastData (json) { //CREATE array of data items
    const forecastDataList = json.list;

    for (let i=0; i < forecastDataList.length; i++) {
        if (i%8 === 0) 
        return forecastDataList;
        console.log(forecastDataList);
    }
}

// function processForecastData (forecastDataList) {

//     let dateForcasted = forecastData.dt_txt.split(' ')[0];
//     let weatherIcon = forecastData.weather[0].icon;
//     let temperature = forecastData.main.temp;
//     let windSpeed = forecastData.wind.speed;
//     let humidity = forecastData.main.humidity;

//     const filteredForecastArray = new Array();

//     for (let i=0; i < forecastDataList.length; i++) {
//         filteredForecastArray.push(dateForcasted, weatherIcon, temperature, windSpeed, humidity)
//     }

//     array.forEach(element => {
        
//     });
// }

//     const filteredForecastArray = new Array(dateForcasted, weatherIcon, temperature, windSpeed, humidity);

//     for (let i=0; i <forecastDataList.length; i++) {
//         return filteredForecastArray;
//     }
//     return filteredForecastArray; //?
// }

// function renderForecastData (filteredForecastArray) {

//     const daySection = $('.days');
//     const dayOneSection = daySection[dayNumber]

//     for (let i=0; i < filteredForecastArray; i += 5) {

//     }
// }

function processForecastData (forecastDataList) {

    let dateForcasted = forecastDataList.dt_txt.split(' ')[0];
    let weatherIcon = forecastDataList.weather[0].icon;
    let temperature = forecastDataList.main.temp;
    let windSpeed = forecastDataList.wind.speed;
    let humidity = forecastDataList.main.humidity;

    // so this should make an array and have the variables stored under object literals
    // that way you can access data wanted through them 

    const filteredForecastArray = new Array();

    for (let i=0; i < forecastDataList.length; i++) {
        filteredForecastArray.push(dateForcasted, weatherIcon, temperature, windSpeed, humidity)
        return filteredForecastArray;
     }
}
 
function renderForecastData (filteredForecastArray, index, i) {

    // const daySection = $('.days');
    // const dayOneSection = daySection[dayNumber]

    // const imgEl = document.createElement('img');
    // imgEl.attr('style', 'background-color: rgb(148, 148, 212);border-radius: 20px;');
    // imgEl.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
    // dayOneSection.appendChild(imgEl);

    // const dayEL = document.createElement('li');
    // dayEl.attr('style', 'list-style:none;');
    
    // for (let i=0; i <)

    const forecastParentNode = $('#five-day-forecast');

    const forecastChildNodes = document.createElement('section');
    forecastChildNodes.addClass('days center background-color border');

    forecastParentNode.appendChild(forecastChildNodes);

    const dateForecastEl = document.createElement('li');
    dateForecastEl.attr('style', 'list-style:none;');
    dateForecastEl.innerText = filteredForecastArray[index].dateForecasted[i];

    const iconForecastEl = document.createElement('img');
    iconForecastEl.attr('style', 'background-color: rgb(148, 148, 212);border-radius: 20px;');
    iconForecastEl.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

    const temperatureEl = document.createElement('li');
    temperatureEl.attr('style', 'list-style:none;');
    temperatureEl.innerText = `${filteredForecastArray[index].temperature[i]} ºC`;

    const windEl = document.createElement('li');
    windEl.attr('style', 'list-style:none;');
    windEl.innerText = `${filteredForecastArray[index].windSpeed[i]} m/sec`;

    const humidityEl = document.createElement('li');
    humidityEl.attr('style', 'list-style:none;');
    humidityEl.innerText = `humidity: ${filteredForecastArray[index].humidity[i]} %`;

    forecastChildNodes.appendChild(dateForecastEl);
    forecastChildNodes.appendChild(iconForecastEl);
    forecastChildNodes.appendChild(temperatureEl);
    forecastChildNodes.appendChild(windEl);
    forecastChildNodes.appendChild(humidityEl);

    for (let i=0; i < filteredForecastArray.length, i++;) {
        forecastParentNode.appendChild(forecastChildNodes)
    }
}