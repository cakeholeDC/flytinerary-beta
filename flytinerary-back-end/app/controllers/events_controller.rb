class EventsController < ApplicationController

	def index
		events = Event.all
		render json: events.to_json(
				# except: [:traveller_id, :updated_at],

				include: [
					traveller_name: { only: :name},
					trip: {
						except: [:traveller_id, :updated_at],
						include: [
							organizer: { only: :name}
							]
						}
				]
			)
	end

end
