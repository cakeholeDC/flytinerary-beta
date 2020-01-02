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

	def show
		event = Event.find(params[:id])

		render json: event.to_json(
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

	def update
		updateEvent = Event.find(params[:id])

		start_date = Event.parseDateTimeString(params[:start])
		end_date = Event.parseDateTimeString(params[:end])

		updateEvent.event_type = params[:event_type]
		updateEvent.description = params[:description]
		updateEvent.start = Time.new(start_date[0], start_date[1], start_date[2], start_date[3], start_date[4])
		updateEvent.end = Time.new(end_date[0], end_date[1], end_date[2], end_date[3], end_date[4])
		updateEvent.save

		render json: updateEvent.to_json(
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

		start_date = Event.parseDateTimeString(params[:start])
		end_date = Event.parseDateTimeString(params[:end])
		
		newEvent = Event.create(
					event_type: params[:event_type], 
					description: params[:description],
					start: Time.new(start_date[0], start_date[1], start_date[2], start_date[3], start_date[4]),
					end: Time.new(end_date[0], end_date[1], end_date[2], end_date[3], end_date[4]),
					trip_id: params[:trip_id],
					traveller_id: params[:traveller_id]
					)
	
		render json: newEvent.to_json(
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

	def destroy
		Event.destroy(params[:id])
	end

end