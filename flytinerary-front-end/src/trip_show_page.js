function getTripData(trip_id) {
	fetch(`${TRIPS_URL}/${trip_id}`)
		.then(response => {
			if (response.ok) {
				return response.json()
			}
		})
		// .then(trip => renderEvents(trip))
		.then(trip => buildAgenda(trip))
		.catch(error => console.log(error.message))
}

function parseTripEvents(trip) {
	const agenda = createWithClasses('div','list')
	agenda.id = "trip-agenda"

	let agendaDate = '' // determines date uniqueness
	let eventsContainer = '' // assigns the UL for each date

	const timeline = trip.event_timeline
	timeline.forEach(event => {
		// first check if the date is unique
		const eventDate = formatDate(event.start)

		// agendaDate will be blank on first iteration
		// then it's set to the previous event's date
		if (agendaDate === '' || agendaDate !== eventDate) {
			agendaDate = eventDate

			const eventDateHeader = createWithClasses('h1','header','large')
			eventDateHeader.innerText = `${agendaDate}` //${event.start.getDay()} 
				// set the container for the event details
				const events = createWithClasses('ul', 'content','list')
				eventsContainer = events
				// eventDateHeader.appendChild(events)

			agenda.appendChild(eventDateHeader)
				agenda.appendChild(events)
		}

		// then show event by time
		const eventTime = createWithClasses('li', "item")
		eventTime.innerText = `${getEventTime(event.start)} - ${getEventTime(event.end)}`
			// then list event details
			const eventDetails = createWithClasses('ul', 'list')
			eventDetails.innerHTML = `<li class=item>${event.description}</li>`
			eventTime.appendChild(eventDetails)
		eventsContainer.appendChild(eventTime)
	})

	return agenda
}


function buildAgenda(trip) {

	const mainContainer = clearMainContainer()
	mainContainer.classList.remove('center')
	mainContainer.classList.add('left')
	mainContainer.classList.add('ui','segment')

	const siteHeader = document.querySelector('#site-header')
	siteHeader.innerText = trip.nickname

	const subHeader = document.querySelector('#site-sub-header')
	subHeader.innerText = `${trip.destination} / ${formatDate(trip.start_date)} — ${formatDate(trip.end_date)}`

	document.querySelector('#search-container').innerHTML = `<i class="plane icon"></i>
				${trip.attendees.length} Travellers`

	const headerContainer = createWithClasses('div','ui','large','header','center','aligned')
	headerContainer.innerText = "Itinerary"

	const createEventBtn = createWithClasses('button','ui','button','right','float')
	createEventBtn.innerText = "Add Event"
	createEventBtn.addEventListener('click', buildNewEventForm)
	headerContainer.appendChild(createEventBtn)
	
	mainContainer.append(headerContainer, parseTripEvents(trip))

}

function buildNewEventForm(event) {
	console.log("Adding Event")

	let agenda = document.querySelector('#trip-agenda')
	
}