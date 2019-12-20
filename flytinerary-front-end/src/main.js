const BASE_URL = 'http://localhost:3000'
const TRIPS_URL = `${BASE_URL}/trips`
const EVENTS_URL = `${BASE_URL}/events`
const SESSION_USER = Math.floor(Math.random() * 7) + 1;

document.addEventListener("DOMContentLoaded", function(){
	console.log("connected")
	getTrips()
	attachEventListeners()
})

function attachEventListeners() {
	document.querySelector('#trip-search').addEventListener('keypress', searchTrip)
	document.querySelector('#return-home').addEventListener('click', () => location.reload())
}

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
			addCurrentTripsHeader()
			trips.forEach(renderTrip)
		})
		.catch(error => console.log(error.message))
}

function addCurrentTripsHeader() {
	const mainContainer = document.querySelector('#main-column')
	mainContainer.innerHTML = ''

	const header = createWithClasses('h2','ui','header')
	header.innerText = "Upcoming Trips:"

	const tripContainer = createWithClasses('div','ui', 'cards', 'stackable', 'centered')
	tripContainer.id = "trip-container"

	mainContainer.append(header, tripContainer)
}

function renderTrip(trip) {
	const tripContainer = document.querySelector('#trip-container')

	const card = createWithClasses('div','card', 'ui', 'raised')

	const cardImage = document.createElement('div')
	cardImage.classList.add('image')
		const image = document.createElement('img')
		image.src = `${trip.image}`

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
	bottomBtn.id = `trip-${trip.id}`
	bottomBtn.addEventListener('click', loadEventPage)
	bottomBtn.innerHTML = `<i class="add icon"></i>Add Events`

    card.append(cardImage, cardBody, cardFooter, bottomBtn)

	tripContainer.appendChild(card)
}

function searchTrip(event) {
    var key = event.which || event.keyCode;
    if (key === 13) { // 13 is enter
		console.log("enter key pressed")

		const searchContent = event.currentTarget.value
		steppedTripContainer(searchContent)
		createTripForm(searchContent)
    }
}

function steppedTripContainer() {
	const mainContainer = document.querySelector('#main-column')
		mainContainer.innerHTML = ''

		mainContainer.innerHTML = `
			<div class="ui three tablet stackable top attached steps">
			  <div id="step-new-trip" class="disabled step">
			    <i class="plane icon"></i>
			    <div class="content">
			      <div class="title">Create New Trip</div>
			      <div class="description">Enter Trip Details</div>
			    </div>
			  </div>
			  <div id="step-trip-events" class="disabled step">
			    <i class="calendar plus icon"></i>
			    <div class="content">
			      <div class="title">Add Events</div>
			      <div class="description">Flights, Rental Car, Check-in etc...</div>
			    </div>
			  </div>
			  <div id="step-trip-confirm" class="disabled step">
			    <i class="check circle icon"></i>
			    <div class="content">
			      <div class="title">Confirm Details</div>
			      <div class="description">Verify Trip Details</div>
			    </div>
			  </div>
			</div>
			<div id="stepped-content" class="ui attached segment left aligned">
			</div>
		`
}

function createTripForm(search) {
	const currentStep = document.querySelector('#step-new-trip')
	currentStep.classList.remove('disabled')
	currentStep.classList.remove('active')
	const steppedContent = document.querySelector('#stepped-content')

	const tripForm = createWithClasses('form', 'ui', 'form')
	tripForm.addEventListener('submit', processTripForm)

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

	let image = createFormInputLabel('Image URL', "text", "image", "Leave this blank and we'll scan the interwebs for a random image of your destination!")

	let submit = createWithClasses('button', 'ui','button')
	submit.innerText = "Create Trip"

	tripForm.append(nickname, destination, dates, image, submit)

	steppedContent.append(tripForm)
}

function processTripForm(event) {
	event.preventDefault()

	let url = event.target.image.value

	const tripBody = {
		nickname: event.target.nickname.value,
    	destination: event.target.destination.value,
    	start_date: event.target.start.value,
    	end_date: event.target.nickname.value,
    	image: url,
    	traveller_id: SESSION_USER
	}

	if (url === "") {
		fetch(`https://source.unsplash.com/290x290/?${event.target.destination.value}`)
			.then(response => {
				if (response.ok){
					url = response.url
				}
			})
			.then(()=> {
				tripBody.image = url
				createNewTrip(tripBody)
			})
			.catch(error => console.log(error.message))
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
			//@TODO - move to the next step using TRIP ID
			console.log(trip)
		})
		.catch(error => console.log(`!!!${error.message}`))

}