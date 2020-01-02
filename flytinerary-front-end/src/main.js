const BASE_URL = 'http://localhost:3000'
const TRIPS_URL = `${BASE_URL}/trips`
const TRAVELLERS_URL = `${BASE_URL}/travellers`
const EVENTS_URL = `${BASE_URL}/events`
var SESSION_USER = Math.floor(Math.random() * 7) + 1;

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

// function showLoginForm() {
// 	console.log('loading home page...')
// 	clearFormBody()
// 	homePageHeader()
// 	const container = getFormBody()
// }

function loadHomePage() {
	console.log('loading home page...')
	clearFormBody()
	getTrips() // goto trips.js
	homePageHeader()
}

function loadAboutPage() {
	console.log('loading about page...')
	clearFormBody()
	homePageHeader()
	
	const content = getPageBody()

	const aboutHeader = createWithClasses('div','ui','header')
	aboutHeader.innerText = "About Flytinerary"

	const aboutContent = createWithClasses('p','content')
	aboutContent.innerHTML = `Flytinerary is a travel itinerary planning appication created by <a target="_blank" href="https://www.kylepcole.com/">Kyle Cole</a> as part of the <a target="_blank" href="https://flatironschool.com/career-courses/coding-bootcamp">Flatiron School's Software Engineering Immersive Bootcamp</a>
					<br><br>Use the field at the top of the page to start planning a trip. Once a trip has been created, you will be able to manage events for that trip.`


	const license = createWithClasses('div', 'content', 'left', 'aligned')
	license.innerText = `MIT License

	Copyright (c) 2020 Kyle P. Cole

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.`
	
	const applicationVersion = createWithClasses('p', 'center', 'aligned')
	applicationVersion.innerText = 'Flytinerary v1.0.0'

	content.append(aboutHeader, aboutContent, applicationVersion, license)
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
	const navBar = createWithClasses('div', 'ui', 'menu', 'inverted', 'huge', 'borderless')
		const navTitle = createWithClasses('div','header','item')
		navTitle.innerHTML = "<i class='plane icon'></i>Flytinerary"
		const navHome = createWithClasses('a', 'item')
		navHome.addEventListener('click', loadHomePage)
		navHome.innerText = 'Home'

		const navAbout = createWithClasses('a','item')
		navAbout.innerText = "About"
		navAbout.addEventListener('click', loadAboutPage)

		const rightMenu = createWithClasses('div','right','menu')

		const loginContainer = createWithClasses('div','item')
			const navLogIn = createWithClasses('div', 'ui', 'button', 'primary')
			navLogIn.innerText = 'Log In'
			// navLogIn.addEventListener('click', showLoginForm)

		loginContainer.append(navLogIn)

		rightMenu.append(loginContainer)

	navBar.append(navTitle, navHome, navAbout, rightMenu)

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

