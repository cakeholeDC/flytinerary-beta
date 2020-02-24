function getTraveller(id) {
	console.log(`getTraveller... fetch(${TRAVELLERS_URL}/${id})`)

	fetch(`${TRAVELLERS_URL}/${id}`)
	  .then(response => {
	  	if (response.ok) {
	  		return response.json()
	  	}
	  })
	  .then(json => {
  		// console.log(json)
  		console.log("success")
	  	return json
	  })
	  .catch(error => console.log(error.message))
}

function showLoginForm() {
	console.log('loading login page...')
	clearFormBody()
	clearPageBody()
	document.querySelector('#log-in-btn').disabled = true

	// navHome.addEventListener('click', loadHomePage)
	// navAbout.addEventListener('click', loadAboutPage)

	homePageHeader()
	document.querySelector('#header-content').querySelector('#sub-header-text').style.display = "none"
	document.querySelector('#header-content').querySelector('#search-container').style.display = "none"
	const container = getFormBody()

	const loginForm = createWithClasses('form', 'ui','form', 'center', 'aligned')
	loginForm.id = "log-in-form"

	const userDiv = createWithClasses('div','field')
			const label = createWithClasses('div','ui','large','header')
			  label.innerText = "Who are you?"
			
			let userSelect = createWithClasses('select', 'ui', 'form', 'selection', 'dropdown')
			  userSelect.name = "user"

			const selectPrefill = document.createElement('option')
			selectPrefill.value = ''
			selectPrefill.innerText = "Select a Traveller"
			selectPrefill.disabled = true
			selectPrefill.selected = true
			userSelect.appendChild(selectPrefill)

	fetch(TRAVELLERS_URL)
		.then(response => {
			if (response.ok) {
				return response.json()
			}
		})
		.then(travellers => {
			travellers.forEach(traveller =>{
			  	let option = document.createElement('option')
			  	option.innerText = traveller.name
			  	option.value = traveller.id
			  	userSelect.appendChild(option)
			})
		})
		.catch(error => console.log(error.message))

	userDiv.append(label, userSelect)

	const submit = createWithClasses('button', 'ui','button', 'right','floated', 'positive')
		submit.innerText = "Start Planning!"

	

	loginForm.append(userDiv, submit)
	loginForm.addEventListener('submit', switchUser)

	container.append(loginForm)
	document.querySelector('#form-container').style.display = 'block'
}

function validateUserForm(form) {
	if (form.user.selectedOptions[0].disabled === true) {
		return false
	}
	else {
		return true
	}
}

function switchUser(event) {
	event.preventDefault()

	if (!validateUserForm(event.currentTarget)) {
		alert("You must select a traveller before browsing!")
	} else {
		const userID = parseInt(event.target.user.selectedOptions[0].value)
		const username = (event.target.user.selectedOptions[0].text)
		SESSION_USER = userID
		const navLogIn = document.querySelector('#log-in-btn')
		navLogIn.innerText = `Log Out: ${username}`
		navLogIn.removeEventListener('click', showLoginForm)
		navLogIn.addEventListener('click', logOut)
		document.querySelector('#log-in-btn').disabled = false
		loadHomePage()
	}
}

function logOut(event) {
	// location.reload()
	const navLogIn = document.querySelector('#log-in-btn')
	document.querySelector('#sign-up-btn').style.display = "block"
	navLogIn.removeEventListener('click', logOut)
	navLogIn.addEventListener('click', showLoginForm)
	navLogIn.innerText = `Log In`
	SESSION_USER = null
	showLoginForm()
}

function createTraveller(event) {
	event.preventDefault()
	showNewTravellerForm()
}


function showNewTravellerForm() {
	console.log('loading newTravellerForm...')
	clearFormBody()
	clearPageBody()
	document.querySelector('#log-in-btn').disabled = true
	document.querySelector('#sign-up-btn').disabled = true

	homePageHeader()
	document.querySelector('#header-content').querySelector('#sub-header-text').style.display = "none"
	document.querySelector('#header-content').querySelector('#search-container').style.display = "none"
	
	const container = getFormBody()
	const label = createWithClasses('div','ui','large','header')
			  label.innerText = "Who are you?"

	const signUpForm = createWithClasses('form', 'ui','form', 'center', 'aligned')
	signUpForm.id = "new-traveller-form"

	const userDiv = createWithClasses('div','field')
		userDiv.innerHTML = `
			<label>Name</label>
			<input type="text" name="name" placeholder="Leroy Jenkins">`
	const ageDiv = createWithClasses('div','field')
		ageDiv.innerHTML = `
			<label>Age</label>
			<input type="number" name="age" placeholder="21">`
	const genderDiv = createWithClasses('div','field')
		genderDiv.innerHTML = `
			<label>Gender</label>
			<select class="ui form selection dropdown" name="gender">
				<option value="" disabled="" selected>Select Gender</option>
				<option value="F">Female</option>
				<option value="M">Male</option>
			</select>`

	const submit = createWithClasses('button', 'ui','button', 'right','floated', 'positive')
		submit.innerText = "Start Planning!"

	signUpForm.append(userDiv, ageDiv, genderDiv, submit)
	signUpForm.addEventListener('submit', processNewTravellerForm)

	container.append(label, signUpForm)
	document.querySelector('#form-container').style.display = 'block'
}

function processNewTravellerForm(event) {
	event.preventDefault()
	const travellerBody = {
			name: event.currentTarget.name.value,
	    	age: event.currentTarget.age.value,
	    	gender: event.currentTarget.gender.selectedOptions[0].value,
		}
	createNewTraveller(travellerBody)
}

function createNewTraveller(body) {
	const travellerConfig = fetchConfig(body, "POST")
	fetch(TRAVELLERS_URL, travellerConfig)
		.then(response => {
			if (response.ok){
				return response.json()
			}
		})
		.then(traveller => {
			SESSION_USER = traveller.id
			const navLogIn = document.querySelector('#log-in-btn')
			navLogIn.innerText = `Log Out: ${traveller.name}`
			navLogIn.removeEventListener('click', showLoginForm)
			navLogIn.addEventListener('click', logOut)
			document.querySelector('#log-in-btn').disabled = false
			document.querySelector('#sign-up-btn').style.display = "none"
			loadHomePage()
		})
		.catch(error => console.log(`!!!${error.message}`))
}