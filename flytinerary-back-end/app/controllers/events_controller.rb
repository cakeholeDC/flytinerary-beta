class EventsController < ApplicationController

	def index
		events = Event.all
		render json: events.to_json(
				except: [:traveller_id, :updated_at, :created_at],

				include: [
					traveller_name: { only: :name},
					trip: {
						except: [:traveller_id, :updated_at, :created_at],
						include: [organizer: { only: :name}]
						}
				]
			)
	end

	def create
		byebug
	end

end
