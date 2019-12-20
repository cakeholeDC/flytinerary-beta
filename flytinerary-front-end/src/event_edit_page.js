function loadEventPage(event) {
	const tripID = event.currentTarget.id.split('-')[1]
	steppedTripContainer()
	const currentStep = document.querySelector('#step-trip-events')
	currentStep.classList.remove('disabled')
	currentStep.classList.add('active')

	getTripEventData(tripID)
}

function getTripEventData(trip_id) {
	fetch(`${TRIPS_URL}/${trip_id}`)
		.then(response => {
			if (response.ok) {
				return response.json()
			}
		})
		.then(trip => renderEvents(trip))
		.catch(error => console.log(error.message))
}

function renderEvents(trip) {
	const steppedContent = document.querySelector('#stepped-content')

	const tripHeader = createWithClasses('h1', 'ui', 'header')
	
	tripHeader.innerText = trip.nickname

	const tripDetails = createWithClasses('div', 'ui','horizontal','segments')
		
		const tripDestination = createWithClasses('div','ui','segment')
		// const destContent = document.createElement('p')
		tripDestination.innerHTML = `<p><i class="map marker alternate icon"></i>${trip.destination}</p>`

		// tripDestination.appendChild(destContent)

		const tripDates = createWithClasses('div','ui','segment','aligned','center')
		// const dateContent = document.createElement('p')
		tripDates.innerHTML = `<p><i class="calendar alternate icon"></i>${formatDate(trip.start_date)} — ${formatDate(trip.end_date)}</p>`

		// tripDates.appendChild(dateContent)

		const tripAttendees = createWithClasses('div','ui','segment')
		// const attendeeContent = document.createElement('p')
		tripAttendees.innerHTML = `<p><i class="plane icon"></i>${trip.attendees.length} Travellers</p>`

		// tripAttendees.appendChild(attendeeContent)

	tripDetails.append(tripDestination, tripDates, tripAttendees)
	/*
<div class="ui segments">
  <div class="ui segment">
    <p>Top</p>
  </div>
  <div class="ui secondary segment">
    <p>Secondary Content</p>
  </div>
</div>
	*/

	steppedContent.append(tripHeader, tripDetails)

	// let eventStats = createWithClasses('div', 'ui', 'statistics')
}

/*
<div class="ui horizontal segments">
  <div class="ui segment">
    <p></p>
  </div>
  <div class="ui segment">
    <p></p>
  </div>
  <div class="ui segment">
    <p></p>
  </div>
</div>
*/


/*
<div class="ui statistics">
  <div class="statistic">
    <div class="value">
      22
    </div>
    <div class="label">
      Saves
    </div>
  </div>
  <div class="statistic">
    <div class="text value">
      Three<br>
      Thousand
    </div>
    <div class="label">
      Signups
    </div>
  </div>
  <div class="statistic">
    <div class="value">
      <i class="plane icon"></i> 5
    </div>
    <div class="label">
      Flights
    </div>
  </div>
  <div class="statistic">
    <div class="value">
      <img src="/images/avatar/small/joe.jpg" class="ui circular inline image">
      42
    </div>
    <div class="label">
      Team Members
    </div>
  </div>
</div>
*/