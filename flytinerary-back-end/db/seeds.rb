Event.destroy_all
Trip.destroy_all
Traveller.destroy_all

# CREATE TRAVELLERS
kyle = Traveller.create!(name: "Kyle Cole", age: 31, gender: "M")
sulli = Traveller.create!(name: "Sulli Norris", age: 30, gender: "F")
dave = Traveller.create!(name: "Dave Conetta", age: 31, gender: "M")
david = Traveller.create!(name: "David Braun", age: 31, gender: "M")
perry = Traveller.create!(name: "Perry Mosbacher", age: 30, gender: "M")
kyle2 = Traveller.create!(name: "Kyle Rowe", age: 31, gender: "M")
scott = Traveller.create!(name: "Scott Tucker", age: 29, gender: "M")
tom = Traveller.create!(name: "Tom White", age: 32, gender: "M")


# CREATE TRIPS
christmas = Trip.create!(
	nickname: "Christmas 2019", 
	destination: "Raleigh, NC", 
	start_date: Time.new(2019, 12, 22), 
	end_date: Time.new(2019, 12, 29), 
	organizer: sulli, 
	image: "https://www.downtownraleigh.org/_files/images/sunset_raleighskyline.jpg")

ski2020 = Trip.create!(
	nickname: "Boys trip to Breckenridge", 
	destination: "Denver, Colorado", 
	start_date: Time.new(2020, 2, 22), 
	end_date: Time.new(2020, 3, 2), 
	traveller_id: perry.id, 
	image: "https://www.colorado.com/sites/default/files/styles/1000x685/public/breckskitown.jpg?itok=wI8d67RA")

paris = Trip.create!(
	nickname: "A Romantic Trip to Paris", 
	destination: "Paris, France", 
	start_date: Time.new(2020, 4, 4), 
	end_date: Time.new(2020, 4, 22), 
	traveller_id: kyle.id, 
	image: "https://d2mpqlmtgl1znu.cloudfront.net/AcuCustom/Sitename/DAM/020/Paris_AdobeStock_264549883_1.jpg")

# CREATE EVENTS
flight1 = Event.create!(
					event_type: "Flight", 
					description: "Kyle's Inbound Flight - AA 1234",
					start: Time.new(2019, 12, 22, 6, 30),
					end: Time.new(2019, 12, 22, 7, 45),
					trip: christmas,
					traveller: kyle
					)

flight2 = Event.create!(
					event_type: "Flight", 
					description: "Kyle's Outbound Flight - AA 1234",
					start: Time.new(2019, 12, 29, 13, 0),
					end: Time.new(2019, 12, 29, 14, 15),
					trip: christmas,
					traveller: kyle
					)

dinnerRes = Event.create!(
					event_type: "Reservation", 
					description: "Reservation at Fancy Restaurant",
					start: Time.new(2019, 12, 22, 6, 30),
					end: Time.new(2019, 12, 22, 7, 45),
					trip: christmas,
					traveller: sulli
					)

checkin = Event.create!(
					event_type: "Check-in", 
					description: "Check-in to AirBnb @ 123 Address St",
					start: Time.new(2019, 12, 22, 15, 00),
					end: Time.new(2019, 12, 22, 15, 15),
					trip: paris,
					traveller: sulli
					)

denCheckIn = Event.create!(
					event_type: "check-in", 
					description: "Check-in to House @ 2020 Colorado Mountain Ave",
					start: Time.new(2020, 2, 22, 10, 00),
					end: Time.new(2020, 2, 22, 11, 00),
					trip: ski2020,
					traveller: perry
					)