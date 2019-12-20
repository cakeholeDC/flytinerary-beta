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
		tripDestination.innerHTML = `<p><i class="map marker alternate icon"></i>${trip.destination}</p>`

		const tripDates = createWithClasses('div','ui','segment','aligned','center')
		tripDates.innerHTML = `<p><i class="calendar alternate icon"></i>${formatDate(trip.start_date)} — ${formatDate(trip.end_date)}</p>`

		const tripAttendees = createWithClasses('div','ui','segment')
		tripAttendees.innerHTML = `<p><i class="plane icon"></i>${trip.attendees.length} Travellers</p>`

	tripDetails.append(tripDestination, tripDates, tripAttendees)

  let eventTable = createWithClasses('table', 'ui', 'striped', 'table')
  eventTable.innerHTML = `
    <thead>
      <tr>
        <th>Traveller</th>
        <th>Event</th>
        <th>Details</th>
        <th>Start</th>
        <th>End</th>
      </tr>
    </thead>`

    const tableBody = document.createElement('tbody')
    eventTable.appendChild(tableBody)

    trip.event_timeline.forEach(activity => {
      const newRow = buildTableRow(activity)
      eventTable.appendChild(newRow)
    })

	steppedContent.append(tripHeader, tripDetails, eventTable)

	// const eventStats = createWithClasses('div', 'ui', 'statistics')
}

function buildTableRow(activity) {
  debugger
  const row = document.createElement('tr')
    const traveller = document.createElement('td')
    traveller.innerText = activity.traveller_name.name
    const event = document.createElement('td')
    event.innerText = activity.event_type

    const details = document.createElement('td')
    details.innerText = activity.description
    
    const start_date = document.createElement('td')
    start_date.innerText = formatDateTime(activity.start)
    const end_date = document.createElement('td')
    end_date.innerText = formatDateTime(activity.end)

  row.append(traveller, event, details, start_date, end_date)
  return row
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