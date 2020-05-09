const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const superagent = require('superagent');

let savedTrips = []
let result = {}
const geoApiUrl = 'http://api.geonames.org/searchJSON'
const weatherBitApiUtl = 'https://api.weatherbit.io/v2.0/forecast/daily'
const pixaBayApiUrl = 'https://pixabay.com/api/'

// configuting server
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('dist'))
app.get('/', function (req, res) { res.sendFile('dist/index.html') })

// configuring env
const dotenv = require('dotenv')
dotenv.config()

app.post('/findTrip', (req, response) => {
    const cityName = req.body.cityName
    result = {}
    getCoordinates(cityName)
        .then(res => {
            if (res && res.body.geonames.length) {
                const firstRow = res.body.geonames[0]
                result.coord = { country: firstRow.countryName, lng: firstRow.lng, lat: firstRow.lat, city: firstRow.name }
                return getImage(cityName)
            }
        })
        .then(res => {
            if (res && res.body.hits.length) {
                result.imgUrl = res.body.hits[0].previewURL
                return result
            }
        }).then((res) => {
            if (res && req.body.forcastDay > -1 && req.body.forcastDay < 16) {
                return getForcast(result.coord.lng, result.coord.lat)
            }
        }).then((res) => {
            console.log(req.body.forcastDay)
            if (res && req.body.forcastDay > -1 && req.body.forcastDay < 16) {
                const forcastRes = res.body.data[req.body.forcastDay]
                result.forcast = { high: forcastRes.high_temp, low: forcastRes.low_temp, description: forcastRes.weather.description }
            }
            response.status(200).send('search completed')
        })

})

app.post('/saveTrip', (req, res) => {
    const trip = req.body
    trip.id = savedTrips.length
    savedTrips.unshift(trip)
    res.status(200).send('trip saved')
})
app.post('/deleteTrip', (req, res) => {
    savedTrips = savedTrips.filter((trip) =>  trip.id != req.body.id )
    res.status(200).send('trip deleted')
})

app.get('/getTripData', (req, res) => {
    res.status(200).send(result);
});

app.get('/getSavedTrips', (req, res) => {
    res.status(200).send(savedTrips);
});


function getCoordinates(cityName) {
    const queryParams = { q: cityName, maxRows: 10, username: process.env.GEOUSERNAME }
    return callApi(geoApiUrl, queryParams)
}

function getForcast(lng, lat) {
    const queryParams = { lat: lat, lon: lng, key: process.env.WEATHERBIT }
    return callApi(weatherBitApiUtl, queryParams)
}

function getImage(cityName) {
    const queryParams = { q: cityName, key: process.env.PIXABAY }
    return callApi(pixaBayApiUrl, queryParams)
}

function callApi(url, queryParams) {
    return superagent.get(url)
        .query(queryParams).then(res => {
            return res
        })

}

module.exports = app