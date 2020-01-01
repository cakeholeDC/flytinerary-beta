const EVENT_TYPES = ['Flight','Food','Lodging','Activity','Reservation','Rental Car']

function loadEventPage(event) {
	const tripID = event.currentTarget.id.split('-')[1]
	getEventData(tripID)
}

//@TODO rename to EVENT data, find references
function getEventData(trip_id) {
	fetch(`${TRIPS_URL}/${trip_id}`)
		.then(response => {
			if (response.ok) {
				return response.json()
			}
		})
		.then(trip => {
			loadAgendaPage(trip)
		})
		.catch(error => console.log(error.message))
}

// function getSingleEventInfo(event_id) {
// 	fetch(`${EVENTS_URL}/${event_id}`)
// 		.then(response => {
// 			if (response.ok) {
// 				return response.json()
// 			}
// 		})
// 		.then(eventData => console.log(event.data))
// 		.catch(error => console.log(error.message))
// }

function loadAgendaPage(trip) {
	const mainContainer = clearPageBody()

	const contentContainer = createWithClasses('div', 'container', 'left','aligned','conlumn')
	contentContainer.id = 'content-container'
	mainContainer.appendChild(contentContainer)

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

	contentContainer.append(headerContainer, buildAgendaTimeline(trip))

}

function buildAgendaTimeline(trip) {
	const agenda = createWithClasses('div','list')
	getPageBody().classList.remove('center')
	getPageBody().classList.add('left')
	agenda.id = `agenda-page`

	let agendaDate = '' // determines date uniqueness
	let eventsContainer = '' // assigns the UL for each date
	// eventsContainer.id = `trip-${trip.id}`

	const timeline = trip.event_timeline

	timeline.forEach(event => {
		// first check if the date is unique
		const eventDate = formatDate(event.start)

		// agendaDate will be blank on first iteration
		// then it's set to the previous event's date
		if (agendaDate === '' || agendaDate !== eventDate) {
			agendaDate = eventDate
			const eventDateHeader = createWithClasses('div','ui', 'header','medium')
			eventDateHeader.innerText = `${formatFullDate(agendaDate)}`
				
				// set the container for the event details
				const events = createWithClasses('ul', 'content','list')
				eventsContainer = events

			agenda.appendChild(eventDateHeader)
				agenda.appendChild(events)
		}

		// then show event by time
		const eventTime = createWithClasses('li', "item")
		eventTime.id = `event-${event.id}-datetime`
		eventTime.innerText = `${getEventTime(event.start)} - ${getEventTime(event.end)}`
			// then list event details
			const eventDetails = createWithClasses('ul', 'list', 'event-hover')
				const eventDesc = createWithClasses('li', 'item','event-hover')
				eventDesc.dataset.id = `event-${event.id}`
				eventDesc.innerText = `${event.description} `
				eventDesc.addEventListener('mouseenter', toggleEditIcon)
				eventDesc.addEventListener('mouseleave', toggleEditIcon)
				eventDesc.addEventListener('click', editEvent)
				const eventType = document.createElement('span')
				eventType.innerHTML = `<strong>${event.event_type} - ${event.traveller_name.name}: </strong>`
				eventDesc.prepend(eventType)

			eventDetails.append(eventDesc)
			eventTime.appendChild(eventDetails)
		eventsContainer.appendChild(eventTime)
	})

	return agenda
}

function toggleEditIcon(event) {
	const target  = event.currentTarget

	if (target.querySelector('i.pencil.icon')) {
		const icon = target.querySelector('i.pencil.icon')
		icon.remove()
	} else {
		const icon = createWithClasses('i',"pencil","icon","small","grey")
		target.appendChild(icon)
	}
}

function editEvent(event) {
	console.log('edit event')

	event.currentTarget.removeEventListener('mouseenter', toggleEditIcon)
	event.currentTarget.removeEventListener('mouseleave', toggleEditIcon)

	const dataID = event.currentTarget.dataset.id.split('-')[1]
	//@TODO add these back after form processing

	buildNewEventForm(event)
	//@TODO add DELETE button.

	//submit actions
	getEventForm().querySelector('button').innerText = "Update Flytinerary"
	getEventForm().removeEventListener('submit', processNewEvent)
	getEventForm().addEventListener('submit', processEditEvent)
	//cancel actions
	const cancelBtn = getEventForm().querySelector('a')
	cancelBtn.classList.remove('negative','left','floated')
	cancelBtn.classList.add('right','floated')
	cancelBtn.innerText = "Nevermind"


	//delete actions
	const deleteBtn = createWithClasses('div','ui', 'button', 'negative','left', 'floated')
	deleteBtn.innerText = "Remove Event"
	deleteBtn.addEventListener('click', deleteEvent)
	deleteBtn.id = `event-${dataID}-delete`
	deleteBtn.dataset.trip = `event-${getEventForm().dataset.id.split('-')[1]}`
	getEventForm().append(deleteBtn)

	const eventID = event.currentTarget.dataset.id.split('-')[1]
	debugger
	const time = getPageBody().querySelector(`#event-${eventID}-datetime`).innerText.split('\n')[0]
	const startTime = time.split('-')[0].trim()
	const endTime = time.split('-')[1].trim()

	const date = event.currentTarget.parentElement.parentElement.parentElement.previousElementSibling.innerText //whoa.

	const domEventContent = event.currentTarget.innerText
	const description = domEventContent.split(":")[1].trim()
	const traveller = domEventContent.split('-')[1].split(":")[0].trim()
	const eventType = domEventContent.split('-')[0].trim()
	// const start = ''
	// const end = ''

	const formTraveller = getEventForm().querySelector('input[name="traveller_id"]')
	formTraveller.value = traveller

	const formType = getEventForm().querySelector('select')
		//reset dropdown default
		formType.querySelector('option[disabled]').selected = false
		//prefill dropdown
		//fnid the option wiht the matching name and set that to selected
		formType.querySelector(`option[value="${eventType.toLowerCase()}"]`).selected = true

	const startField = getEventForm().querySelector('input[name="start"]')
	startField.value = prefillDateTime(new Date(date + ' ' + startTime))

	const endField = getEventForm().querySelector('input[name="end"]')
	endField.value = prefillDateTime(new Date(date + ' ' + endTime))

	getEventForm().querySelector('textarea').value = description

	toggleEditIcon(event)
}

function processEditEvent(event) {
	// body...
	event.preventDefault()
	console.log('processEditEvent')
	//@ TODO add JS form validator 

	if (!validateEventForm(event.target)) {
		alert("That was required last time... you think we'd let you leave it out now?")
	} else {
		const formID = event.target.dataset.id
		const tripID = Number(formID.split('-')[1])

		const editEventBody = {
			event_type: event.target.event_type.selectedOptions[0].text,
	    	start: event.target.start.value,
	    	end: event.target.end.value,
	    	description: event.target.description.value,
	    	trip_id: tripID,
	    	//TRAVELLER ID DOES NOT UPDATE WITH EDITS
	    	// traveller_id: SESSION_USER
		}

		const eventConfig = fetchConfig(editEventBody, "PATCH")

		fetch(EVENTS_URL, eventConfig)
			.then(response => {
				if (response.ok){
					return response.json()
				}
			})
			.then(event => {
				getEventData(event.trip_id)
			})
			.catch(error => console.log(`!${error.message}!`))
		// body...

		const createEventBtn = document.querySelector("#add-event-btn")
		createEventBtn.style.display = "inline-block"
		createEventBtn.classList.add('right')
		createEventBtn.classList.remove('center')

	}

	event.currentTarget.addEventListener('mouseenter', toggleEditIcon)
	event.currentTarget.addEventListener('mouseleave', toggleEditIcon)
	clearFormBody()
}

function deleteEvent(event) {
	// body...
	const dataID = event.currentTarget.dataset.id.split('-')[1]
	const tripID = event.currentTarget.dataset.trip.split('-')[1]
	const deleteConfig = fetchConfig('', 'DELETE')

	fetch(`${EVENTS_URL}/${dataID}`,deleteConfig)
		.then(response => {
			if (response.ok) {
				debugger
				loadEventPage(event)
			}
		})
		.catch(error => console.log(error.message))

}

function getEventForm() {
	const form = document.querySelector('#new-event-form')
	return form
}

function buildNewEventForm(event) {
	console.log("Adding Event Form")
	document.querySelector("#add-event-btn").style.display = "none"

	let formBody = document.querySelector('#form-body')
	const formHeader = createWithClasses('h2', 'ui','header')
	formHeader.id = 'event-form-header'
	formHeader.innerText = "Add Flytinerary Item"

	let form = createWithClasses('form', 'ui','form')
	form.dataset.id = event.currentTarget.dataset.id
	form.id = 'new-event-form'
		
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


			//@TODO make trip end date disasbled. all events should be a single day.
			const tripStart = new Date(tripDates.split('—')[0].trim())
			const tripEnd = new Date(tripDates.split('—')[1].trim())

			const start_end = createWithClasses('div','two','fields')
			  const start = createFormInputLabel('Event Start', "datetime-local", "start", '', prefillDateTime(tripStart))
			  const end = createFormInputLabel('Event End', "datetime-local", "end", '', prefillDateTime(tripEnd, true))
			//@TODO rework functions to accept string so 'new Date' doesn't have to be used when defining tripStart and tripEnd

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
		submit.innerText = "Add to Flytinerary"

		const cancel = createWithClasses('a','ui','button', 'negative','left','floated')
		cancel.innerText = "Nevermind, still planning..."
		cancel.addEventListener('click', cancelForm)


	form.append(traveller, eventType, dates, description, submit, cancel)
	form.addEventListener('submit', processNewEvent)
		
	const divider = document.createElement('hr')
	divider.classList.add('short')

	formBody.prepend(formHeader, form, divider)
	document.querySelector('#form-container').style.display = 'block'
}

function cancelForm(event) {
	console.log('cancel form')
	const tripID = document.querySelector('form').remove()
	event.currentTarget.remove()
	const createEventBtn = document.querySelector("#add-event-btn")
	createEventBtn.style.display = "inline-block"
	createEventBtn.classList.add('right')
	createEventBtn.classList.remove('center')
	clearFormBody()
	// document.querySelector('#event-form-header').remove()
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

		clearFormBody()

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
			getEventData(event.trip_id)
		})
		.catch(error => console.log(`!!!${error.message}`))
	// body...
}