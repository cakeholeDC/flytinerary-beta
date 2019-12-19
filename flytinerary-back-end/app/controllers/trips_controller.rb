class TripsController < ApplicationController

	def index
		trips = Trip.all
		render json: trips.to_json(
				except: [:traveller_id, :updated_at],
				include: [
					organizer: { only: :name} ,
					travellers: {except: [:created_at, :updated_at]},
					events: {except: [:created_at, :updated_at]}
				]
			)
	end

end
