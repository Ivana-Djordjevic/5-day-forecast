function saveToStorage(newCity){
    const history = JSON.parse(localStorage.getItem('history'));
        if(history.includes(newCity)){
            return;
        }
    history.push(newCity)
        if(history.length > 5){
            history.shift()
        }
    localStorage.setItem('history', JSON.stringify(history));
    loadStorage();
}

function loadStorage(){
    const history = JSON.parse(localStorage.getItem('history'));
        if(!history){
            localStorage.setItem('history', JSON.stringify([]))
            return;
        }
    const searchHistoryEl = $('#search-history');
    searchHistoryEl.innerText = '';

    history.forEach(city =>{
        const button = document.createElement('button');
        button.innerText = city;
        button.addEventListener('click', function(){
            onCitySearch(city)
        })
        searchHistoryEl.append(button);
    })
}

const myApiKey = '0fffcdb9d9732daced94e2c5d89e2a50';

$().ready(function(){
    const cityInputValue = $('#city-form');
    cityInputValue.on('submit', getCityInputValue); 
})

async function onCitySearch(cityName) { 
    const coordinates = await fetchCityCoordinates(cityName);
    const weatherData = await fetchWeather(coordinates);
    const consolidatedData = consolidateWeatherData(weatherData);

    const renderWeather= renderWeatherData(consolidatedData);

    const forecastData = await fetchForecast(coordinates);
    const filterData = filterForecastData(forecastData);

    const parse = parseForecastData(filterData);
    const render = renderForecastData(parse);
}

function getCityInputValue(event) {
    event.preventDefault();

    const cityInputValue = $('input').val().trim();
        if (!cityInputValue) {
            throw new Error('No input.');
        }
    onCitySearch(cityInputValue) 
}

function fetchCityCoordinates(cityInputValue) {

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q='${cityInputValue}&appid=${myApiKey}`;
    const geoResponsePromise = fetch(geoUrl);
    const geoDataPromise = geoResponsePromise.then(function (response) {
            if (!response.ok) {
                throw response.json(); 
            }
            return response.json();
        })
    const coordinatesPromise = geoDataPromise.then(function (json) {
        return {
            lat: json[0].lat,
            lon: json[0].lon,
        }
    })
    return coordinatesPromise;
}

function fetchWeather(coordinates) {
    const lat = coordinates.lat;
    const lon = coordinates.lon; 

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=metric`;

    const weatherResponsePromise = fetch(weatherUrl);
    const weatherDataPromise = weatherResponsePromise.then(function (response) {
        if (!response.ok) {
            throw response.json();
        }
        return response.json();
        })
    return weatherDataPromise; 
}
function consolidateWeatherData (weatherJson) {
    const weatherData = weatherJson;
    const cityName = weatherData.name;
    saveToStorage(cityName);

    const date = dayjs().format('YYYY, dddd MMM D'); 
    const weatherIcon = weatherData.weather[0].icon;
    const temperature = weatherData.main.temp;
    const windspeed = weatherData.wind.speed;    
    const humidity = weatherData.main.humidity;

    const weatherDataArray = [cityName, weatherIcon, temperature, windspeed, humidity, date];
    return weatherDataArray;
}

function renderWeatherData(data) {
    //#region
    //this one seems kinda long, but is there  a point to breaking it down if 
    // all the data can be easily reached in here
    // the more it's broken down, the more i have to pass data around
    // maybe for consistency i could arrange them in the same style as the 5 day forecast
    //TBD, functional for now, optimize later
    // later, find a way to not create elements each time
    //#endregion    
    const weatherParentNode = $('#current-weather');
    weatherParentNode.empty();
    const weatherChildNodes = document.createElement('section');

    weatherChildNodes.className = weatherChildNodes.className 
    + 'center background-color'; 

    weatherParentNode.append(weatherChildNodes);

    const nameEl = document.createElement('h2');
    nameEl.innerText = data[0];

    const dateEl = document.createElement('li');
    dateEl.setAttribute('style', 'list-style:none;');
    dateEl.innerText = `${data[5]}`;

    const iconEl = document.createElement('img');
    iconEl.setAttribute('style', 'background-color: rgb(148, 148, 212);border-radius: 20px;');
    iconEl.src = `https://openweathermap.org/img/wn/${data[1]}.png`;

    const temperatureEl = document.createElement('li');
    temperatureEl.setAttribute('style', 'list-style:none;');
    temperatureEl.innerText = `${data[2]} ºC`;

    const windEl = document.createElement('li');
    windEl.setAttribute('style', 'list-style:none;');
    windEl.innerText = `${data[3]} m/sec`;

    const humidityEl = document.createElement('li');
    humidityEl.setAttribute('style', 'list-style:none;');
    humidityEl.innerText = `humidity: ${data[4]} %`;

    weatherChildNodes.appendChild(nameEl);
    weatherChildNodes.appendChild(dateEl);
    weatherChildNodes.appendChild(iconEl);
    weatherChildNodes.appendChild(temperatureEl);
    weatherChildNodes.appendChild(windEl);
    weatherChildNodes.appendChild(humidityEl);
}

function fetchForecast(coordinates) { 
    const lat = coordinates.lat;
    const lon = coordinates.lon;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myApiKey}&units=metric`;

    const forecastResponsePromise = fetch(forecastUrl);
    const forecastDataPromise = forecastResponsePromise.then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })
    return forecastDataPromise; 
}

function filterForecastData (json) { 
    const forecastDataList = json.list;
    const forecastDataArray = [];
        for (let i=0; i < forecastDataList.length; i++) {
            const isEighthIndex = i%8 === 0;
            if (isEighthIndex) {
                forecastDataArray.push(forecastDataList[i]);
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
    forecastParentNode.empty();
        for (let i=0; i < forecastDataArray.length; i++) {
            const forecastChildNodes = renderForecastDataItem(forecastDataArray[i]);
            forecastParentNode.append(forecastChildNodes);
        }
}

function renderForecastDataItem (dataItem){
    const forecastChildNodes = document.createElement('section');

    forecastChildNodes.setAttribute('id', dataItem.dateForecasted);

    forecastChildNodes.className = forecastChildNodes.className 
        + 'center background-color border margin-bottom';

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

loadStorage();