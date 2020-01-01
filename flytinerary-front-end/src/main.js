const BASE_URL = 'http://localhost:3000'
const TRIPS_URL = `${BASE_URL}/trips`
const TRAVELLERS_URL = `${BASE_URL}/travellers`
const EVENTS_URL = `${BASE_URL}/events`
const SESSION_USER = Math.floor(Math.random() * 7) + 1;

document.addEventListener("DOMContentLoaded", function(){
	console.log("connected")
	loadHomePage()
	addNavBar()
	attachEventListeners()
})

function attachEventListeners() {
	// document.querySelector('#trip-search').addEventListener('keypress', newTrip)
	// document.querySelector('#header-bar').addEventListener('click', () => loadHomePage())
}

function getHeaderBar() {
	const pageHeader = document.querySelector('#header-bar')
	return pageHeader
}

function loadHomePage() {
	console.log('loading home page...')
	clearFormBody()
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

function getFormBody() {
	const formBody = document.querySelector('#form-body')
	return formBody
}

function clearFormBody() {
	const formBody = document.querySelector('#form-body')
	formBody.innerHTML = ''
	document.querySelector('#form-container').style.display = 'none'
	return formBody
}

function homePageHeader() {
	const headerText = getHeaderBar().querySelector("#header-text")
	headerText.innerText = 'Welcome to 🛫 Flytinerary 🛬'
	const subHead = getHeaderBar().querySelector('#sub-header-text')
	subHead.innerText = "Where are you headed?"

	addSearchBar()
	clearPageBody()

	getHeaderBar().style.backgroundImage = `none`;
	getHeaderBar().querySelector('#header-container').style.background = "none"
	getHeaderBar().querySelector('#header-container').style.color = "#FFFFFF"
	getHeaderBar().querySelector('#header-container').style.borderRadius = "0px"
	getHeaderBar().querySelector('#header-container').style.padding = "0px"

	getHeaderBar().querySelector('#header-container h1').classList.add('inverted')

	getPageBody().classList.remove('left','aligned','column')
	getPageBody().classList.add('center','aligned','column')
}

function addSearchBar() {
	if (document.querySelector('#search-container')) {
		searchContainer = document.querySelector('#search-container')
		searchContainer.innerHTML = ''
	} else {
		searchContainer = createWithClasses('div', 'ui','search')
		searchContainer.id = 'search-container'
	}
	const searchDiv = createWithClasses('div', 'ui', 'icon', 'input')
		const searchField = createWithClasses('input', 'prompt')
		  searchField.id = 'trip-search'
		  searchField.type = 'text'
		  searchField.placeholder = "Paris, France"
		  searchField.addEventListener('keypress', showNewTripForm)
		const searchIcon = createWithClasses('i', 'search', 'icon')
	searchDiv.append(searchField, searchIcon)

	searchContainer.append(searchDiv)

	getHeaderBar().querySelector('#header-content').appendChild(searchContainer)
	// return searchContainer
}

function addNavBar() {
	const navBar = createWithClasses('div', 'ui', 'menu', 'inverted', 'mini', 'borderless')
		const navTitle = createWithClasses('div','header','item')
		navTitle.innerHTML = "<i class='plane icon'></i>Flytinerary"
		const navHome = createWithClasses('a', 'item')
		navHome.addEventListener('click', loadHomePage)
		navHome.innerText = 'Home'

		const rightMenu = createWithClasses('div','right','menu')

		const loginContainer = createWithClasses('div','item')
			const navLogIn = createWithClasses('div', 'ui', 'button', 'primary')
			navLogIn.innerText = 'Log In'
		loginContainer.append(navLogIn)

		rightMenu.append(loginContainer)

	navBar.append(navTitle, navHome, rightMenu)

	document.querySelector('.page').prepend(navBar)
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

