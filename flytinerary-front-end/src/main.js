const BASE_URL = 'http://localhost:3000'
const TRIPS_URL = `${BASE_URL}/trips`
const TRAVELLERS_URL = `${BASE_URL}/travellers`
const EVENTS_URL = `${BASE_URL}/events`
const SESSION_USER = Math.floor(Math.random() * 7) + 1;

document.addEventListener("DOMContentLoaded", function(){
	console.log("connected")
	loadHomePage()
	attachEventListeners()
})

function attachEventListeners() {
	document.querySelector('#trip-search').addEventListener('keypress', newTrip)
	// document.querySelector('#header-bar').addEventListener('click', () => loadHomePage())
}

function getHeaderBar() {
	const pageHeader = document.querySelector('#header-bar')
	return pageHeader
}

function loadHomePage() {
	console.log('loading home page...')
	getTrips() // goto trips.js
	homePageHeader()
}

function getPageBody() {
	const pageBody = document.querySelector('#page-body')
	return pageBody
}

function clearPageBody() {
	const pageBody = document.querySelector('#page-body')
	pageBody.innerHTML = ''
	return pageBody
}

function homePageHeader() {
	const headerText = getHeaderBar().querySelector("#header-text")
	headerText.innerText = 'Welcome to 🛫 Flytinerary 🛬'
	const subHead = getHeaderBar().querySelector('#sub-header-text')
	subHead.innerText = "Where are you headed?"

	getHeaderBar().querySelector('#header-container').appendChild(addSearchBar())
}

function addSearchBar() {
	const search = document.querySelector('#search-container') ? document.querySelector('#search-container') : createWithClasses('div', 'ui','search')
	search.id = 'search-container'
	search.innerHTML = `
		<div class="ui icon input">
			<input id="trip-search" class="prompt" type="text" placeholder="Paris, France">
			<i class="search icon"></i>
		</div>`

	return search
}



function steppedTripContainer() {
	const mainContainer = document.querySelector('#page-body')
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

