

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
    const forecastData = await fetchForecast(coordinates);
    // console.log(forecastData);
    const filterData = filterForecastData(forecastData);
    const parse = parseForecastData(filterData);
    console.log(parse)
    const render = renderForecastData(parse);
}

function getCityInputValue() {
    const cityInputValue = $('input').val().trim();
    
    if (!cityInputValue) {
        throw new Error('No input.');
    }
    return cityInputValue;
}

function fetchCityCoordinates(cityInputValue) {

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q='${cityInputValue}&appid=${myApiKey}`;
    const geoResponsePromise = fetch(geoUrl);
    const geoDataPromise = geoResponsePromise.then(function (response) {

            if (!response.ok) {
                throw response.json(); 
            }
            // console.log(response); 
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


function fetchForecast(coordinates) { 
    const lat = coordinates.lat;
    const lon = coordinates.lon;
    // console.log(lat);

    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=metric`;

    const forecastResponsePromise = fetch(weatherUrl);
    const forecastDataPromise = forecastResponsePromise.then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            // console.log(response); 
            return response.json();
        })

    return forecastDataPromise; //?
}

function filterForecastData (json) { //CREATE array of data items
    const forecastDataList = json.list;
    const forecastDataArray = [];

    for (let i=0; i < forecastDataList.length; i++) {
        const isEighthIndex = i%8 === 0;
        if (isEighthIndex) {
            forecastDataArray.push(forecastDataList[i]);
        // console.log(forecastDataList);
        } 
    }
    return forecastDataArray;
}

function getConsolidatedForecastData (forecastDataList) {

    const dateForecasted = forecastDataList.dt_txt.split(' ')[0];
    const weatherIcon = forecastDataList.weather[0].icon;
    const temperature = forecastDataList.main.temp;
    const windSpeed = forecastDataList.wind.speed;
    const humidity = forecastDataList.main.humidity;

    return {dateForecasted, weatherIcon, temperature, windSpeed, humidity};
}
 
function parseForecastData(forecastDataArray) {
    return forecastDataArray.map(getConsolidatedForecastData);
}

function renderForecastData (forecastDataArray) {
    const forecastParentNode = $('#five-day-forecast');
    // console.log(forecastParentNode)
    for (let i=0; i < forecastDataArray.length; i++) {
        const forecastChildNodes = renderForecastDataItem(forecastDataArray[i]);
        forecastParentNode.append(forecastChildNodes);
    }
}

function renderForecastDataItem (dataItem){
    // console.log(dataItem);
    const forecastChildNodes = document.createElement('section');

    forecastChildNodes.setAttribute('id', dataItem.dateForecasted);

    forecastChildNodes.className = forecastChildNodes.className 
        + 'days center background-color border';

    const dateForecastEl = document.createElement('li');
    dateForecastEl.setAttribute('style', 'list-style:none;');
    dateForecastEl.innerText = dataItem.dateForecasted;

    const iconForecastEl = document.createElement('img');
    iconForecastEl.setAttribute('style', 'background-color: rgb(148, 148, 212);border-radius: 20px;');
    iconForecastEl.src = `https://openweathermap.org/img/wn/${dataItem.weatherIcon}.png`;

    const temperatureEl = document.createElement('li');
    temperatureEl.setAttribute('style', 'list-style:none;');
    temperatureEl.innerText = `${dataItem.temperature} ºC`;

    const windEl = document.createElement('li');
    windEl.setAttribute('style', 'list-style:none;');
    windEl.innerText = `${dataItem.windSpeed} m/sec`;

    const humidityEl = document.createElement('li');
    humidityEl.setAttribute('style', 'list-style:none;');
    humidityEl.innerText = `humidity: ${dataItem.humidity} %`;

    forecastChildNodes.appendChild(dateForecastEl);
    forecastChildNodes.appendChild(iconForecastEl);
    forecastChildNodes.appendChild(temperatureEl);
    forecastChildNodes.appendChild(windEl);
    forecastChildNodes.appendChild(humidityEl);

    return forecastChildNodes;
}