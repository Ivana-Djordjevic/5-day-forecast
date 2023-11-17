// a function that maintains a history of cities in local storage. 
//It prevents duplicates, limits the history to 5 entries, and updates the local storage accordingly. 
function saveToStorage(newCity){
    // #region
    // this variable retrieves the value paired with the key 'history' from local storage, 
    // and turns it to a JS object
    // #endregion
    const history = JSON.parse(localStorage.getItem('history'));
        // #region
        // checks  if the new value of newCity is already present in the local storage
        // includes() is method that determines whether an array includes a certain value among its entries, returning true or false as appropriate.
        // If it is, the function immediately returns without making any changes. This is to prevent duplicate entries in the history.
        // #endregion
        if(history.includes(newCity)){
            return;
        }
    // #region
    // If the newCity is not already in the history, this line adds the newCity to the end of the history array using the push() method.
    // the push() method adds the newCity to the end of an array
    // #endregion
    history.push(newCity)
    // #region
    // This checks if the length of the history array is greater than 5. 
    // If it is, the shift() method is used to remove the first (oldest) entry from the array. 
    // This ensures that the history doesn't exceed a maximum of 5 entries.
    // #endregion
        if(history.length > 5){
            history.shift()
        }
    // #region
    // After the modifications to the history array, 
    // this line stores the updated array back in the local storage under the key 'history'. 
    // The array is converted to a JSON string using JSON.stringify() before saving.
    // #endregion
    localStorage.setItem('history', JSON.stringify(history));

    // calling loadStorage() is necessary to refresh the displayed search history to reflect the changes made by the saveToStorage() function.
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

// this function waits for the DOM to be fully loaded, 
// selects a form element with the ID "city-form," and adds a submit event listener to it. 
// When the form is submitted, it calls the getCityInputValue function
$().ready(function(){
    const cityInputValue = $('#city-form');
    cityInputValue.on('submit', getCityInputValue); 
})

//this is where all the magic happens
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
    //This prevents the browser from reloading the page, which is the default behavior when a form is submitted.
    event.preventDefault();

    // This line uses jQuery to select an <input> element on the page and retrieves the value of the selected input 
    // The .val() method gets the current value of the input, 
    // and .trim() is used to remove any leading and trailing whitespace from the value 
    // The resulting trimmed value is stored in the cityInputValue variable.
    const cityInputValue = $('input').val().trim();

        // conditional statement that prevents an empty/null input from proceding further with the code
        // will throw an error in the input is invalid 
        if (!cityInputValue) {
            throw new Error('No input.');
        }

    // the value stored in cityInputValue is passed to a function called onCitySearch
    onCitySearch(cityInputValue) 
}

// function that retrieves the latitude and longitude coordinates of a city using the OpenWeatherMap API
function fetchCityCoordinates(cityInputValue) {

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q='${cityInputValue}&appid=${myApiKey}`;

    // This line initiates an HTTP request to the URL defined in geoUrl using the fetch function. 
    // fetch returns a Promise that will resolve with the response to the request
    const geoResponsePromise = fetch(geoUrl);

    // This line sets up a Promise chain. 
    //It uses the .then method to handle the response from the geoResponsePromise. 
    // #region .then explanation
    // Promises have a lifecycle, and .then() is one of the methods for handling the result of a Promise
    // Chaining .then(): You can chain .then() methods onto a Promise to specify what should happen when the Promise is resolved. 
    // Each .then() takes a callback function as an argument, and that function will be executed when the Promise resolves successfully. 
    // #endregion
    //If the response is not successful (i.e., if response.ok is false), it throws an error by calling response.json(). 
    //This means that if the API request fails, the promise will be rejected with the JSON representation of the response.
    const geoDataPromise = geoResponsePromise.then(function (response) {
            if (!response.ok) {
                throw response.json(); 
            }
            return response.json();
        })

    //This line continues the Promise chain by using the .then method on geoDataPromise. 
    //It extracts the latitude and longitude information from the JSON response (json[0].lat and json[0].lon) and returns it as an object. 
    //This Promise will resolve with the coordinates data.
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