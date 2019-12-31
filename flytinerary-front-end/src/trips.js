function getTrips() {
	fetch(TRIPS_URL)
		.then(response => {
			if (response.ok) {
				return response.json()
			} else {
				console.log("Fetch failed...")
			}
		})
		.then(trips => {
			addUpcomingTripsHeader()
			trips.forEach(renderTripCard)
		})
		.catch(error => console.log(error.message))
}

function addUpcomingTripsHeader() {
	const mainContainer = getPageBody()

	const header = createWithClasses('h2','ui','header')
	header.innerText = "Upcoming Trips:"

	const tripContainer = createWithClasses('div','ui', 'cards', 'stackable', 'centered')
	tripContainer.id = "trip-container"

	mainContainer.append(header, tripContainer)
}

function renderTripCard(trip) {
	const tripContainer = document.querySelector('#trip-container')

	const card = createWithClasses('div','card', 'ui', 'raised', 'link')
	card.id = `trip-${trip.id}`
	card.addEventListener('click', getSingleTrip)

	const cardImage = document.createElement('div')
	cardImage.classList.add('image')
		const image = document.createElement('img')
		image.src = `${trip.image}`
		image.classList.add('card-image')

	cardImage.append(image)

	const cardBody = createWithClasses('div','content')
		
		const header = createWithClasses('div','header')
		header.innerText = `${trip.nickname}`

		const dates = createWithClasses('div','meta')
		dates.innerText = `${formatDate(trip.start_date)} — ${formatDate(trip.end_date)}`
		
		const description = createWithClasses('div','description')
		description.innerText = `${trip.destination}`

		const travellers = createWithClasses('div','meta')
		travellers.innerHTML = `<i class="plane icon"></i>
				${trip.attendees.length} Travellers`

	cardBody.append(header, dates, description, travellers)

	const cardFooter = document.createElement('div')
	cardFooter.classList.add('extra', 'content')

		const hostDetails = createWithClasses('span','right', 'floated')
		hostDetails.innerText = `Hosted by ${trip.organizer.name}`

		const eventDetails = createWithClasses('span','left', 'floated')
		eventDetails.innerText = `${trip.events.length} Events`

	cardFooter.append(hostDetails, eventDetails)

	const bottomBtn = createWithClasses('div', 'ui', 'bottom', 'attached', 'button')
	// bottomBtn.id = `trip-${trip.id}`
	// bottomBtn.addEventListener('click', loadEventPage)
	// bottomBtn.innerHTML = `<i class="add icon"></i>Add Events`
	bottomBtn.innerHTML = `<i class="calendar alternate icon"></i>View Flytinerary`

    card.append(cardImage, cardBody, cardFooter, bottomBtn)

	tripContainer.appendChild(card)
}

function newTrip(event) {
    var key = event.which || event.keyCode;
    if (key === 13) { // 13 is enter
		console.log("enter key pressed")

		const searchContent = event.currentTarget.value
		event.currentTarget.disabled = true
		debugger
		
		createTripForm(searchContent)
    }
}

function createTripForm(search) {
	const mainContainer = getPageBody()

	mainContainer.classList.remove('left', 'aligned', 'column')
	mainContainer.classList.add('center', 'aligned', 'column')

	const header = createWithClasses('h2','ui','header')
	header.innerText = "Plan an Adventure!"

	const tripFormContainer = createWithClasses('div','ui','centered')
	tripFormContainer.id = "trip-form-container"

	const tripForm = createWithClasses('form', 'ui', 'form')
	tripForm.addEventListener('submit', processTripForm)
	tripForm.id = 'new-trip-form'


	const nickname = createFormInputLabel("Trip Nickname", "text", "nickname", "Bill & Ted's Excellent Adventure")
	const destination = createFormInputLabel("Destination", "text", "destination", "Paris, France", search)

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

	const image = createFormInputLabel('Image URL', "text", "image", "Leave this blank and we'll find an image matching your destination!")

	const submit = createWithClasses('button', 'ui','button', 'positive')
	submit.innerText = "Schedule Trip"

	tripForm.append(nickname, destination, dates, image, submit)

	const divider = document.createElement('hr')
	divider.classList.add('short')

	tripFormContainer.append(tripForm, divider)
	mainContainer.prepend(header, tripFormContainer)
}

function processTripForm(event) {
	event.preventDefault()

	if (!validateTripForm(event.target)) {
		alert("Please fill out the Trip form before proceeding...")
	} else {
		let url = event.target.image.value

		const tripBody = {
			nickname: event.target.nickname.value,
	    	destination: event.target.destination.value,
	    	start_date: event.target.start.value,
	    	end_date: event.target.end.value,
	    	image: url,
	    	traveller_id: SESSION_USER
		}
		//if the user did not provie an image, fetch one using their destination search query
		if (url === "") {
			fetch(`https://source.unsplash.com/500x500/?${event.target.destination.value}`)
				.then(response => {
					if (response.ok){
						url = response.url
					}
				})
				.then(()=> {
					//URL is a random 500x500 image using query params
					tripBody.image = url
					createNewTrip(tripBody)
				})
				.catch(error => console.log(error.message))
		} else {
			createNewTrip(tripBody)
		}
	}
}

function validateTripForm(form) {
	if (form.nickname.value === '' ||
		form.destination.value === '' ||
		form.start.value === '' ||
		form.end.value === '' ) {
		return false
	} else {
		return true
	}
}

function createNewTrip(body) {
	const tripConfig = fetchConfig(body, "POST")

	fetch(TRIPS_URL, tripConfig)
		.then(response => {
			if (response.ok){
				return response.json()
			}
		})
		.then(trip => {
			loadTripPage(trip)
		})
		.catch(error => console.log(`!!!${error.message}`))

}

function getSingleTrip(event) {
	const id = event.currentTarget.id.split('-')[1]
	fetch(`${TRIPS_URL}/${id}`)
		.then(response => {
			if (response.ok) {
				return response.json()
			} else {
				console.log("Fetch failed...")
			}
		})
		.then(trip => loadTripPage(trip))
		.catch(error => console.log(error.message))
}

function loadTripPage(trip) {  // FETCH source IS getSingleTrip() from TRIP.js
	console.log("loadTripPage Event Triggered")
	createTripHeader(trip)
	loadAgendaPage(trip)
}

function setTripBackground(url) {
	getHeaderBar().style.backgroundImage = `url('${url}')`;
	getHeaderBar().style.backgroundRepeat = "no-repeat"
	getHeaderBar().style.backgroundSize = "cover"
	getHeaderBar().style.backgroundPosition = "center"
	getHeaderBar().querySelector('#header-container').style.background = "rgba(255, 255, 255, .7)"
	getHeaderBar().querySelector('#header-container').style.color = "#000000"
	getHeaderBar().querySelector('#header-container').style.borderRadius = "25px"
	getHeaderBar().querySelector('#header-container').style.padding = "10px"

	getHeaderBar().querySelector('#header-container h1').classList.remove('inverted')
}

function createTripHeader(trip) {
	setTripBackground(trip.image)
	const headerText = getHeaderBar().querySelector("#header-text")
	headerText.innerText = trip.nickname
	const subHead = getHeaderBar().querySelector('#sub-header-text')
	subHead.innerHTML = `${trip.destination}<p>${formatDate(trip.start_date)} — ${formatDate(trip.end_date)}</p>`
	
	const addnlContent = document.querySelector('#search-container')
	addnlContent.innerHTML = `
		<i class="plane icon"></i>
		${trip.attendees.length} Travellers`

	if (trip.attendees.length > 0) {
		addnlContent.appendChild(addTripAttendees(trip))
	}

	const editTripBtn = createWithClasses('button', 'ui', 'button', 'orange')
	editTripBtn.innerHTML = `<i class="pencil icon"></i>Edit Trip`
	editTripBtn.addEventListener('click', editTrip)
	editTripBtn.dataset.id = `trip-${trip.id}`
	editTripBtn.id = 'edit-trip-button'
	editTripBtn.disabled = false;
	editTripBtn.dataset.tripName = trip.nickname
	subHead.appendChild(editTripBtn)

	const deleteTripBtn = createWithClasses('button', 'ui', 'button', 'negative')
	deleteTripBtn.innerHTML = `<i class="x icon"></i>Cancel Trip`
	deleteTripBtn.addEventListener('click', deleteTrip)
	deleteTripBtn.dataset.id = `trip-${trip.id}`
	deleteTripBtn.id = 'delete-trip-button'
	deleteTripBtn.dataset.tripName = trip.nickname
	subHead.appendChild(deleteTripBtn)
}

function addTripAttendees(trip) {
	let travellerList = createWithClasses('ul', 'content', 'list')
	travellerList.id = 'trips-traveller-list'
	trip.attendees.forEach(attendee =>{
		traveller = createWithClasses('li', 'item')
		traveller.innerText = attendee.name
		travellerList.appendChild(traveller)
	})
	return travellerList
}



function deleteTrip(event) {
	const reallyDelete = confirm(`Are you sure you want to cancel ${event.currentTarget.dataset.tripName}?`)

    if (reallyDelete) {
    	tripID = event.currentTarget.dataset.id.split('-')[1]

    	deleteConfig = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Accept":"application/json"
			}
		}

		fetch(`${TRIPS_URL}/${tripID}`, deleteConfig)
		  .then(response => {
		  	if (response.ok) {
		  		clearPageBody()
		  		loadHomePage()
		  	} 
		  })
		  .catch(error => console.log(error.message))
	}
}

function editTrip(event) {
	console.log('its ok, we all have to change our plans sometimes.')
	const tripID = event.currentTarget.dataset.id

	createTripForm()

	document.querySelector('#edit-trip-button').disabled = true;

	getPageBody().querySelector('h2.ui.header').innerText = "It's ok, we all change plans."
	getPageBody().querySelector('#new-trip-form button').innerText = "Reschedule Trip"

	const tripForm = document.querySelector('#new-trip-form')
	tripForm.removeEventListener('submit', processTripForm)
	tripForm.addEventListener('submit', processTripUpdate)
	tripForm.dataset.id = tripID
	
	const nickname = document.querySelector('#header-text').innerText
	const destination = document.querySelector('#sub-header-text').innerText.split("\n")[0]

	const dates = document.querySelector('#sub-header-text').innerText.split("\n")[2]

	const start = dates.split(' — ')[0]
	const end = dates.split(' — ')[1]
	const image = getHeaderBar().style.backgroundImage.slice(4, -1).replace(/"/g, "")

	// THEN PREFILL FORM
	tripForm.querySelector('input[name="nickname"]').value = nickname
	tripForm.querySelector('input[name="destination"]').value = destination
	tripForm.querySelector('input[name="start"]').value = prefillDate(start)
	tripForm.querySelector('input[name="end"]').value = prefillDate(end)
	tripForm.querySelector('input[name="image"]').value = image
}

function processTripUpdate(event) {
	console.log('rescheduling trip')
	event.preventDefault()
	const id = event.currentTarget.dataset.id.split('-')[1]

	if (!validateTripForm(event.target)) {
		alert("Please fill out the Trip form before proceeding...")
	} else {
		let url = event.target.image.value

		const tripBody = {
			nickname: event.target.nickname.value,
	    	destination: event.target.destination.value,
	    	start_date: event.target.start.value,
	    	end_date: event.target.end.value,
	    	image: url,
	    	traveller_id: SESSION_USER
		}

		//if the user did not provie an image, fetch one using their destination search query
		if (url === "") {
			console.log('fetching image')
			fetch(`https://source.unsplash.com/500x500/?${event.target.destination.value}`)
				.then(response => {
					if (response.ok){
						url = response.url
						console.log('image found')
						console.log(url)
					}
				})
				.then(()=> {
					//URL is a random 500x500 image using query params
					tripBody.image = url
					updateTrip(id, tripBody)
				})
				.catch(error => console.log(error.message))
		} else {
			updateTrip(id, tripBody)
		}
	}
}

function updateTrip(id, body) {
	console.log('updating trip in rails...')
	const tripConfig = fetchConfig(body, "PATCH")

	fetch(`${TRIPS_URL}/${id}`, tripConfig)
		.then(response => {
			if (response.ok){
				return response.json()
			}
		})
		.then(trip => {
			loadTripPage(trip)
		})
		.catch(error => console.log(`!!!${error.message}`))

}