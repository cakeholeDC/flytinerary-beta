const EVENT_TYPES = ['Flight','Food','Lodging','Activity','Reservation','Rental Car']

function loadEventPage(event) {
	const tripID = event.currentTarget.id.split('-')[1]
	getTripData(tripID)


	// // stepped interface
	// steppedTripContainer() //loads the stepped interface, all disabled
	// const currentStep = document.querySelector('#step-trip-events')
	// currentStep.classList.remove('disabled')
	// currentStep.classList.add('active')

  // getTripEventData(tripID)
}

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

//CURRENTLY UNUSED AS OF 12/20/2019
function getEventIcon(event_type) {
	let icon = document.createElement('i')
	icon.className = ('icon')
	switch (event_type) {
		case 'Flight':
			icon.classList.add('plane')
		case 'Food':
			icon.classList.add('utensils')
		case 'Lodging':
			icon.classList.add('building')
		case 'Activity':
			icon.classList.add('bicycle')
		case 'Reservation':
			icon.classList.add('calendar')
		case 'Rental Car':
			icon.classList.add('car')
		default:
			icon.className = ''
	}
	return icon
}

function loadAgendaPage(trip) {
	const mainContainer = clearPageBody()
	const headerContainer = createWithClasses('div','ui','large','header','center','aligned')

	const header = createWithClasses('h2','ui','header')
	header.innerText = "Flytinerary:"

	const createEventBtn = createWithClasses('button','ui','button','right','floated', 'primary')
	if (trip.event_timeline.length === 0) {
		createEventBtn.classList.remove('right')
		createEventBtn.classList.add('center')
		createEventBtn.style.marginRight = 0;
	}
	createEventBtn.innerText = "Add Event"
	createEventBtn.id = "add-event-btn"
	createEventBtn.dataset.id = `trip-${trip.id}`
	createEventBtn.addEventListener('click', buildNewEventForm)
	headerContainer.append(header, createEventBtn)

	mainContainer.append(headerContainer, buildAgendaTimeline(trip))

}

function buildAgendaTimeline(trip) {
	const agenda = createWithClasses('div','list')
	getPageBody().classList.remove('center')
	getPageBody().classList.add('left')
	agenda.id = `agenda-page`

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
			const eventDateHeader = createWithClasses('div','ui', 'header','medium')
			// eventDateHeader.innerText = `${getDayFromDate(agendaDate)}, ${agendaDate}`
			eventDateHeader.innerText = `${formatFullDate(agendaDate)}`
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

function buildNewEventForm(event) {
	console.log("Adding Event Form")
	document.querySelector('#page-body .ui.header h2').innerText = "Add Flytinerary Item"
	document.querySelector("#add-event-btn").style.display = "none"

	let agenda = document.querySelector('#page-body .list')

	let form = createWithClasses('form', 'ui','form')
	form.dataset.id = event.currentTarget.dataset.id
		
		const traveller = createFormInputLabel("Traveller", "text", "traveller_id", "Traveller Name")
			traveller.id = "traveller-id"

			//@TODO lookup traveller name using getTraveller() from travellers.js
			traveller.querySelector('input').value = SESSION_USER 
			// current user only. @todo, user dropdown???
			traveller.querySelector('input').disabled = true

		const eventType = createWithClasses('div','field')
			const label = createWithClasses('label')
			  label.innerText = "Event Type"
			
			let select = createWithClasses('select', 'ui', 'form', 'selection', 'dropdown')
			  select.name = "event_type"

			const selectPrefill = document.createElement('option')
			selectPrefill.value = ''
			selectPrefill.innerText = "Select Event Type"
			selectPrefill.disabled = true
			selectPrefill.selected = true
			select.appendChild(selectPrefill)

			  EVENT_TYPES.forEach(type => {
			  	let option = document.createElement('option')
			  	option.innerText = type
			  	option.value = type.toLowerCase()
			  	select.appendChild(option)
			  })
		eventType.append(label, select)
			  
		const dates = createWithClasses('div','field')
			const tripDates = document.querySelector('#sub-header-text p').innerText

			const tripStart = new Date(tripDates.split('—')[0].trim())
			// console.log(`tripStart = ${tripStart}`)
			const tripEnd = new Date(tripDates.split('—')[1].trim())
			// console.log(`tripEnd = ${tripEnd}`)

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


		const submit = createWithClasses('button', 'ui','button', 'right','floated', 'positive')
		submit.innerText = "Create Event"

	form.append(traveller, eventType, dates, description, submit)
	form.addEventListener('submit', processNewEvent)
		
	const cancel = createWithClasses('button','ui','button', 'negative')
	cancel.innerText = "Cancel"
	cancel.addEventListener('click', cancelForm)

	agenda.prepend(form, cancel)
}

function cancelForm(event) {
	console.log('cancel form')
	const tripID = document.querySelector('form').remove()
	event.currentTarget.remove()
	const createEventBtn = document.querySelector("#add-event-btn")
	createEventBtn.style.display = "inline-block"
	createEventBtn.classList.add('right')
	createEventBtn.classList.remove('center')
}

function processNewEvent(event) {
	event.preventDefault()
	console.log('processNewEvent')
	//@ TODO add JS form validator 

	if (!validateEventForm(event.target)) {
		alert("Please fill out the Event form before proceeding...")
	} else {
		const formID = event.target.dataset.id
		const tripID = Number(formID.split('-')[1])

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
		const createEventBtn = document.querySelector("#add-event-btn")
		createEventBtn.style.display = "inline-block"
		createEventBtn.classList.add('right')
		createEventBtn.classList.remove('center')

	}
}

function validateEventForm(form) {
	if (form.event_type.selectedOptions[0].disabled === true || 
		form.description.value === '' ||
		form.start.value === '' ||
		form.end.value === '') {
		return false
	}
	else {
		return true
	}
}

function createNewEvent(body) {
	console.log("createNewEvent")
	const eventConfig = fetchConfig(body, "POST")

	fetch(EVENTS_URL, eventConfig)
		.then(response => {
			if (response.ok){
				return response.json()
			}
		})
		.then(event => {
			getTripData(event.trip_id)
		})
		.catch(error => `!!!${error.message}`)
	// body...
}