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
	agenda.id = `trip-${trip.id}-agenda`

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
	subHeader.innerText = `${trip.destination}: ${formatDate(trip.start_date)} — ${formatDate(trip.end_date)}`

	document.querySelector('#search-container').innerHTML = `<i class="plane icon"></i>
				${trip.attendees.length} Travellers`

	const headerContainer = createWithClasses('div','ui','large','header','center','aligned')
	headerContainer.innerText = "Itinerary"
	headerContainer.id = 'trip-agenda-header'

	const createEventBtn = createWithClasses('button','ui','button','right','floated')
	createEventBtn.innerText = "Add Event"
	createEventBtn.id = "new-event-button"
	createEventBtn.addEventListener('click', buildNewEventForm)
	headerContainer.appendChild(createEventBtn)
	
	mainContainer.append(headerContainer, buildAgendaTimeline(trip))

}

function buildNewEventForm(event) {
	console.log("Adding Event")
	document.querySelector("#new-event-button").style.display = "none"

	let agenda = document.querySelector('#main-column .list')

	let form = createWithClasses('form', 'ui','form')
		
		const traveller = createFormInputLabel("Traveller", "text", "traveller_id", "Traveller Name")
			traveller.id = "traveller-id"
			traveller.querySelector('input').value = SESSION_USER

		const eventType = createWithClasses('div','field')
			const label = createWithClasses('label')
			  label.innerText = "Event Type"
			
			let select = createWithClasses('select', 'ui', 'form', 'selection', 'dropdown')
			  select.name = "event_type"
			  // select.placeholder = "Event Type"
			  select.innerHTML = `
			  		  <option value="" disabled selected>Select Event Type</option>
				      <option value="flight">Flight</option>
				      <option value="food">Food</option>
				      <option value="lodging">Lodging</option>
				      <option value="activity">Activity</option>
				      <option value="reservation">Reservation</option>
			  `

		eventType.append(label, select)
			  
		const dates = createWithClasses('div','field')
			// const dateLabel = document.createElement('label', 'container')
			// dateLabel.innerText = "Event Dates"
			// dates.appendChild(dateLabel)

			const tripDates = document.querySelector('#site-sub-header').innerText.split(':')

			const tripStart = new Date(tripDates[1].split('—')[0].trim())
			const tripEnd = new Date(tripDates[1].split('—')[1].trim())

			const start_end = createWithClasses('div','two','fields')
			  const start = createFormInputLabel('Event Start', "datetime-local", "start", '', prefillDateTime(tripStart)) //@TODO rework function to accept string
			  const end = createFormInputLabel('Event End', "datetime-local", "end", '', prefillDateTime(tripEnd, true))

			start_end.append(start, end)
		dates.appendChild(start_end)

		const description = createWithClasses('div', 'field')
		  const descLabel = document.createElement('label')
			descLabel.innerText = "Description"
		  const descArea = document.createElement('textarea')
			descArea.rows = 2
			descArea.name = "description"
			descArea.placeholder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nulla..."
		description.append(descLabel, descArea)

		let submit = createWithClasses('button', 'ui','button', 'right','floated')
		submit.innerText = "Create Event"

	form.append(traveller, eventType, dates, description, submit)
	form.addEventListener('submit', processNewEvent)

	agenda.prepend(form)

}

function processNewEvent(event) {
	event.preventDefault()
	console.log('processNewEvent')
	//@ TODO add JS form validator 

	const agendaPage = document.querySelector('#main-column .list')
	const tripID = Number(agendaPage.id.split('-')[1])

	const newEventBody = {
		event_type: event.target.event_type.selectedOptions[0].text,
    	start: event.target.start.value,
    	end: event.target.end.value,
    	description: event.target.description.value,
    	trip_id: tripID,
    	// let user select another traveller
    	// traveller_id: event.target.description.traveller_id,
    	// OR
    	// traveller is ALWAYS current user
    	traveller_id: SESSION_USER
	}

	createNewEvent(newEventBody)
	document.querySelector("#new-event-button").style.display = "inline-block"

}

function valdateEventForm(form) {
	let validForm = form
}

function createNewEvent(body) {
	const eventConfig = fetchConfig(body, "POST")

	fetch(EVENTS_URL, eventConfig)
		.then(response => {
			if (response.ok){
				return response.json()
			}
		})
		.then(json => {
			debugger
			console.log(json.trip_id)
		})
		.catch(error => `!!!${error.message}`)
	// body...
}