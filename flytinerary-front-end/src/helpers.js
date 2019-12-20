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
	const day = date.getDate()
	// month_offset offsets the month by one if true
	if (month_offset) {
		month += 1
		if (month === 13) {
			month = '01'
			year = year + 1
		}
	}

	return `${year}-${month}-${day}`
}

function formatDateTime(datetime) {
	const date = new Date(Date.parse(datetime))
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const am_pm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+ minutes : minutes;
	const humanTime = hours + ':' + minutes + ' ' + am_pm;
	return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + humanTime;
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