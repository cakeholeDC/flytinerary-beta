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