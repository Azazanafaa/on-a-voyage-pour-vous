const baseUrl = 'http://localhost:8082'

const deleteTripFromServer = async (id) => {
  const response = await fetch(baseUrl + '/deleteTrip', {
      method: 'POST',
      mode: 'cors',
      cridentials: 'same-orgin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
  })
  try {
      const res = await response
      return res
  } catch (error) {
      console.log('error deleting', error)
  }
}

const findTrip = async (data, countDownDays) => {
  const response = await fetch(baseUrl + '/findTrip', {
      method: 'POST',
      mode: 'cors',
      cridentials: 'same-orgin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cityName: data, forcastDay: countDownDays })
  })
  try {
      const res = await response
      return res
  } catch (error) {
      console.log('error searching', error)
  }
}

const getTripData = async (url = '') => {
  const response = await fetch(baseUrl + url)
  try {
      const res = await response.json()
      return res
  } catch (error) {
      console.log('error getting data', error)
  }
}

const saveInServer = async (trip) => {
  const response = await fetch(baseUrl + '/saveTrip', {
      method: 'POST',
      mode: 'cors',
      cridentials: 'same-orgin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip)
  })
  try {
      const res = await response
      return res
  } catch (error) {
      console.log('error getting data', error)
  }
}

export {deleteTripFromServer , saveInServer, getTripData, findTrip}