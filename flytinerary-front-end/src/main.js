const BASE_URL = 'http://localhost:3000'
const TRIPS_URL = `${BASE_URL}/trips`
const SESSION_USER = 1

document.addEventListener("DOMContentLoaded", function(){
	console.log("connected")
	getTrips()
	attachEventListeners()
})

function attachEventListeners() {
	document.querySelector('#trip-search').addEventListener('keypress', searchTrip)
}

function searchTrip(event) {
    var key = event.which || event.keyCode;
    if (key === 13) { // 13 is enter
		console.log("enter key pressed")

		const searchContent = event.currentTarget.value

		// const modalDiv = document.querySelector('#modals-div')
		// modalDiv.className = ''
		// modalDiv.classList.add('ui', 'dimmer', 'modals', 'page', 'transition', 'visible', 'active', 'centered')
		
		// const newTripModal = document.querySelector('#new-trip-modal')
		// newTripModal.className = ''
		// newTripModal.classList.add('ui', 'standard', 'test', 'modal', 'transition', 'visible', 'active')
    }
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

	const header = document.createElement('h2')
	header.classList.add('ui', 'header')
	header.innerText = "Upcoming Trips:"

	const tripContainer = document.createElement('div')
	tripContainer.classList.add('ui', 'cards', 'stackable', 'centered')
	tripContainer.id = "trip-container"
}

function renderTrip(trip) {
	const tripContainer = document.querySelector('#trip-container')

	const card = document.createElement('div')
	card.classList.add('card', 'ui', 'raised')

	const cardImage = document.createElement('div')
	cardImage.classList.add('image')
		const image = document.createElement('img')
		image.src = `${trip.image}`

	cardImage.append(image)

	const cardBody = document.createElement('div')
	cardBody.classList.add('content')
		
		const header = document.createElement('div')
		header.classList.add('header')
		header.innerText = `${trip.nickname}`

		const dates = document.createElement('div')
		dates.classList.add('meta')
		dates.innerText = `${formatDate(trip.start_date)} to ${formatDate(trip.end_date)}`
		
		const description = document.createElement('div')
		description.classList.add('description')
		description.innerText = `${trip.destination}`

		const travellers = document.createElement('div')
		travellers.classList.add('meta')
		travellers.innerHTML = `<i class="plane icon"></i>
				${trip.travellers.length} Fellow Travellers`

	cardBody.append(header, dates, description, travellers)

	const cardFooter = document.createElement('div')
	cardFooter.classList.add('extra', 'content')

		const hostDetails = document.createElement('span')
		hostDetails.classList.add('right', 'floated')
		hostDetails.innerText = `Hosted by ${trip.organizer.name}`

		const eventDetails = document.createElement('span')
		eventDetails.classList.add('left', 'floated')
		eventDetails.innerText = `${trip.events.length} Events`

	cardFooter.append(hostDetails, eventDetails)

	const bottomBtn = document.createElement('div')
	bottomBtn.classList.add('ui', 'bottom', 'attached', 'button')
	bottomBtn.id = `trip-${trip.id}`
	bottomBtn.addEventListener('click', (event)=> console.log(event.currentTarget))
	bottomBtn.innerHTML = `<i class="add icon"></i>Add Events`

    card.append(cardImage, cardBody, cardFooter, bottomBtn)

	tripContainer.appendChild(card)
}

function formatDate(datetime) {
	date = new Date(Date.parse(datetime))
	//@TODO add Month Name lookup array
	return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
}

function formatDateTime(datetime) {
	date = new Date(Date.parse(datetime))
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const am_pm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+ minutes : minutes;
	const humanTime = hours + ':' + minutes + ' ' + am_pm;
	return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + humanTime;
}