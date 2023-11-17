const myApiKey = '0fffcdb9d9732daced94e2c5d89e2a50';

//idea: 

// let weatheApi = 'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=' + myApiKey

// let geoApi =    'https://api.openweathermap.org/geo/1.0/direct?q=sacramento,ca,us&appid=' + myApiKey

// fetch(geoApi)
//     .then(function(response){
//         return response.json()
//     })
//     .then(function(data) {
//         console.log(data)
//         fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + data[0].lat +'&lon=' + data[0].lon + '&appid=' + myApiKey)
//             .then(function(resp) {
//                 return resp.json()
//             })
//             .then(function(data) {
//                 console.log(data)
//             })
//     })

// now let's clean it up:

const base = 'https://api.openweathermap.org'
const geo = 'geo/1.0/direct'
const weather = 'data/2.5'
const currentWeather = 'weather'
const forecast = 'forecast'

function buildWeatherApiUrl(lat, lon, format) {
    return `${base}/${weather}/${format}?lat=${lat}&lon=${lon}&appid=${myApiKey}`
}

function buildGeoApiUrl(city, state, country) {
    return `${base}/${geo}?q=${city},${state},${country}&appid=${myApiKey}`
}

function getWeather(lat, lon, format) {
    fetch(buildWeatherApiUrl(lat, lon, format))
        .then(function(resp) {
            return resp.json()
        })
        .then(function(data) {
            console.log(data)
        })
}

function searchCityWeather(geoSearch, callback) {
    let {city, state, country} = geoSearch

    fetch(buildGeoApiUrl(city, state, country))
        .then(function(resp) {
            return resp.json()
        })
        .then(function(data) {
            callback(data[0].lat, data[0].lon)
        })
}

let search = {
    city: 'sacramento',
    state: 'ca', 
    country: 'us'
}

searchCityWeather(search, 
    function(lat, lon){
        getWeather(lat, lon, currentWeather)
        getWeather(lat, lon, forecast)
    }
)