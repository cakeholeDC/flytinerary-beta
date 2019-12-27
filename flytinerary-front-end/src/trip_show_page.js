function getTripData(trip_id) {
	fetch(`${TRIPS_URL}/${trip_id}`)
		.then(response => {
			if (response.ok) {
				return response.json()
			}
		})
		// .then(trip => renderEvents(trip))
		.then(trip => loadAgendaPage(trip))
		.catch(error => console.log(error.message))
}

function buildAgendaTimeline(trip) {
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


function loadAgendaPage(trip) {

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
	headerContainer.id = 'trip-agenda-header'

	const createEventBtn = createWithClasses('button','ui','button','right','float')
	createEventBtn.innerText = "Add Event"
	createEventBtn.addEventListener('click', buildNewEventForm)
	headerContainer.appendChild(createEventBtn)
	
	mainContainer.append(headerContainer, buildAgendaTimeline(trip))

}

function buildNewEventForm(event) {
	console.log("Adding Event")

	let agenda = document.querySelector('#trip-agenda')

	let form = createWithClasses('form', 'ui','form')

		const eventType = createWithClasses('div','field')
			const label = createWithClasses('label')
			  label.innerText = "Event Type"
			
			let select = createWithClasses('select')
			  select.name = "event_type"
			  select.placeholder = "Event Type"
			  select.innerHTML = `
			  	<option name="flight">Flight</option>
				<option name="food">Food</option>
				<option name="lodging">Lodging</option>
				<option name="activity">Activity</option>
			  `

		eventType.append(label, select)
			  
		const dates = createWithClasses('div','field')
			const dateLabel = document.createElement('label')
			dateLabel.innerText = "Trip Dates"
			dates.appendChild(dateLabel)

			const today = new Date()
			const start_end = createWithClasses('div','two','fields')
			  const start = createFormInputLabel('Depart', "date", "start", '', prefillDate(today))
			  const end = createFormInputLabel('Return', "date", "end", '', prefillDate(today, true))

			start_end.append(start, end)
		dates.appendChild(start_end)

		const description = createFormInputLabel("Description", "text", "description", "Lorem ipsum dolor a mi...")
		const traveller = createFormInputLabel("Traveller", "text", "traveller_id", "Traveller Name", "TEST CONTENT")
			traveller.id = "traveller-id"

		let submit = createWithClasses('button', 'ui','button')
		submit.innerText = "Create Event"

	form.append(eventType, dates, description, traveller)

	agenda.prepend(form)

}