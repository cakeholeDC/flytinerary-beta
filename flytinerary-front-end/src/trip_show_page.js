function getTripData(trip_id) {
	fetch(`${TRIPS_URL}/${trip_id}`)
		.then(response => {
			if (response.ok) {
				response.json()
			}
		})
		.then(renderTrip)
		.catch(error => console.log(error.message))
}