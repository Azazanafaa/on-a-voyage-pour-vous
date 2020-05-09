import {deleteTripFromServer , saveInServer, getTripData, findTrip} from "./service";
const cityInput = document.getElementById('city-name')
const departInput = document.getElementById('depart-date')
const returnInput = document.getElementById('return-date')
const modal = document.querySelector('.modal')
const modalContent = document.querySelector('.modal-content')
const cards = document.querySelector('.cards-holder')
const errorSpan = document.querySelector('.error-dates')
let countDownDays = -1
let tripDuration = -1
let trip



// Event listener for onclik submit form
function handleSubmit() {
    const cityName = cityInput.value
    if (departInput.value && cityName) {
        const departDate = new Date(departInput.value);
        const retrunDate = new Date(returnInput.value);
        const today = new Date();
        getCountDown(departDate, retrunDate, today)
        if ((departDate - today > -1 || countDownDays == 0 ) && (!returnInput.value || retrunDate - departDate > -1)) {
            errorSpan.style.display = 'none'
            findTrip(cityName, countDownDays)
                .then((res) => {
                    console.log('post response', res)
                    return getTripData('/getTripData')
                }).then((res) => {
                    if (res) {
                        trip = res
                        showModal(res)
                    }
                })
        } else {
            errorSpan.style.display = 'block'
        }

    }
    departInput.style.border = !departInput.value ? '1px solid #ef443b' : '1px solid #ccc'
    cityInput.style.border = !cityInput.value ? '1px solid #ef443b' : '1px solid #ccc'

}

function showModal(data) {
    console.log('data')

    let content = `<span onclick="return Client.closePopUp()" class="close">&times;</span>
    <div class="modal-body">
        <img src="${data.imgUrl}" alt="">
        <div class="trip-info">
            <header>Destination: ${data.coord.city}, ${data.coord.country}</header>
            <div class="trip-date">Departure date: ${departInput.value}</div>`
    if (tripDuration > 0) {
        content += `<div class="trip-countdown">${tripDuration} day(s) in ${data.coord.city}, ${data.coord.country} is ${countDownDays} day(s) away</div>`
    } else {
        content += `<div class="trip-countdown">${data.coord.city}, ${data.coord.country} is ${countDownDays} day(s) away</div>`
    }
    if (data.hasOwnProperty('forcast')) {
        content += ` <div class="trip-weather">It will be:</div>
        <div class="trip-weather-status">${data.forcast.description}</div>
        <div class="trip-temp">Low: ${data.forcast.low} | High: ${data.forcast.high}</div> 
        </div></div>`
    } else {
        content += `
        <div class="no-forcast">Forcast is only available for trips within 16 days</div>
        </div></div>
        `
    }
    content += `<div class="modal-footer">
        <button class="btn-save" onclick="return Client.saveTrip()">Save Trip</button>
        <button class="btn-cancel" onclick="return Client.closePopUp()">Cancel</button>
    </div>`

    modalContent.innerHTML = ''
    modalContent.insertAdjacentHTML('afterbegin', content)
    modal.style.display = "block";
}

function saveTrip() {
    trip.info = { countdown: countDownDays, depart: departInput.value, duration: tripDuration }
    closePopUp()
    saveInServer(trip).then((res) => {
        return getTripData('/getSavedTrips')
    }).then(res => updateUi(res))
}

function updateUi(data) {
    cards.innerHTML = ''
    for (let trip of data) {
        let content = `<div class="card-trip">
        <span onclick="return Client.deleteTrip(${trip.id})" class="close">&times;</span>
        <img src="${trip.imgUrl}" alt="">
            <div class="trip-info">
                <header>Destination: ${trip.coord.city}, ${trip.coord.country}</header>
                <div class="trip-date">Departure date: 12/85/1567</div>
                <div class="trip-countdown">`
        if (trip.info.duration > 0) {
            content += `${trip.info.duration} day(s) in `
        }
        if (trip.hasOwnProperty('forcast')) {
            content += `${trip.coord.city}, ${trip.coord.country} is ${trip.info.countdown} day(s) away</div>
                <div class="trip-weather">It will be:</div>
                <div class="trip-weather-status">Cloudy</div>
                <div class="trip-temp">low: 12 | high: 25</div>
            </div>
        </div>`
        } else {
            content += `${trip.coord.city}, ${trip.coord.country} is ${trip.info.countdown} day(s) away</div>
            </div></div> `
        }
        cards.insertAdjacentHTML('beforeend', content)
    }

}

function deleteTrip(id) {
    deleteTripFromServer(id).then((res) => {
        return getTripData('/getSavedTrips')
    }).then(res => {
        updateUi(res)
    })
}



function getCountDown(departDate, retrunDate, today) {
    const ONE_DAY = 1000 * 60 * 60 * 24;
    if (returnInput.value) {
        tripDuration = Math.round(Math.abs(departDate - retrunDate) / ONE_DAY) + 1
    } else {
        tripDuration = -1
    }
    countDownDays = Math.round(Math.abs(departDate - today) / ONE_DAY) - 1

}



function closePopUp() {
    modal.style.display = "none"
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none"
    }
}




// Exporting handling submit to be imported in index.js
export { handleSubmit, closePopUp, saveTrip, deleteTrip }
