function formatDate(datetime) {
	const date = new Date(Date.parse(datetime))
	//@TODO add Month Name lookup array
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return `${month}/${day}/${year}`
}

function prefillDate(datetime, month_offset) {
	const date = new Date(Date.parse(datetime))
	let year = date.getFullYear()
	let month = date.getMonth() + 1
	let day = date.getDate()
	// month_offset offsets the month by one if true
	if (month_offset) {
		month += 1
		if (month === 13) {
			month = '01'
			year = year + 1
		}
	}

	if (month.toString().length === 1) {
		month = `0${month}`
	}
	if (day.toString().length === 1) {
		day = `0${day}`
	}

	return `${year}-${month}-${day}`
}

function formatDateTime(datetime) {
	const date = new Date(Date.parse(datetime))
	let hours = date.getHours();
	let minutes = date.getMinutes();
	const am_pm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+ minutes : minutes;
	const humanTime = hours + ':' + minutes + ' ' + am_pm;
	
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	return `${month}/${day}/${year} at ${humanTime}`;
}

function prefillDateTime(datetime, offset) {
	const date = new Date(Date.parse(datetime))
	let hours = date.getHours() ;
	let minutes = date.getMinutes();
	let month = date.getMonth() + 1
	let day = date.getDate()
	const year = date.getFullYear()

	if (hours.toString().length === 1) {
		hours = `0${hours}`
	}

	if (minutes.toString().length === 1) {
		minutes = `0${minutes}`
	}
	const humanTime = hours + ':' + minutes

	if (month.toString().length === 1) {
		month = `0${month}`
	}
	if (day.toString().length === 1) {
		day = `0${day}`
	}
	//"2019-12-31T10:00"
	return `${year}-${month}-${day}T${humanTime}`;
}


function getEventTime(datetime) {
	const date = new Date(Date.parse(datetime))
	let hours = date.getHours();
	let minutes = date.getMinutes();
	const am_pm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+ minutes : minutes;
	const humanTime = hours + ':' + minutes + ' ' + am_pm;

	return `${humanTime}`;
}

function getDayFromDate(datetime) {
	const date = new Date(Date.parse(datetime))
	const day = date.getDay()
	switch (day) {
		case 0:
			return "Sunday"
		case 1:
			return "Monday"
		case 2:
			return "Tuesday"
		case 3:
			return "Wednesday"
		case 4:
			return "Thursday"
		case 5:
			return "Friday"
		case 6:
			return "Saturday"
	} 
}

function getMonthFromDate(datetime) {
	const date = new Date(Date.parse(datetime))
	const month = date.getMonth()
	switch (month) {
		case 0:
			return "January"
		case 1:
			return "February"
		case 2:
			return "March"
		case 3:
			return "April"
		case 4:
			return "May"
		case 5:
			return "June"
		case 6:
			return "July"
		case 7:
			return "August"
		case 8:
			return "September"
		case 9:
			return "October"
		case 10:
			return "November"
		case 11:
			return "December"
	} 
}

function formatFullDate(datetime) {
	const date = new Date(Date.parse(datetime))

	const year = date.getFullYear()
	const day = date.getDate()

	return `${getDayFromDate(datetime)}, ${getMonthFromDate(datetime)} ${day}, ${year}`
}

// DOM Creation Helpers
function createWithClasses(element, ...classListValues) {
	const newElement = document.createElement(element)
	classListValues.forEach(name => {
		newElement.classList.add(`${name}`)
	})
	return newElement
}

function createFormInputLabel(label,type,name,placeholder, value) {
	const fieldSet = createWithClasses('div', 'field')
	if (label !== ''){
		const fieldLabel = document.createElement('label')
		fieldLabel.innerText = label
		fieldSet.append(fieldLabel)
	}
	const fieldInput = document.createElement('input')
	fieldInput.type = type
	fieldInput.name = name
	fieldInput.placeholder = placeholder

	if (value) {
		fieldInput.value = value
	}

	fieldSet.append(fieldInput)
	return fieldSet	
}

function fetchConfig(content, method="GET") {
	const configObj = {
		method: method,
		headers: {
			"Content-Type": "application/json",
			"Accept":"application/json"
		},
		body: JSON.stringify(content)
	}
	return configObj
}