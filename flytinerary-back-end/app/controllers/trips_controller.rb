class TripsController < ApplicationController

	def index
		trips = Trip.all
		render json: trips.to_json(
				except: [:traveller_id, :updated_at, :created_at],
				include: [
					organizer: { only: :name} ,
					# travellers: {except: [:created_at, :updated_at]},
					attendees: {except: [:created_at, :updated_at, :id]},
					events: {
						include: [traveller_name: { only: :name}],
						except: [:created_at, :updated_at, :traveller_id, :trip_id]
					}
				]
			)
	end
	
	def show
		trip = Trip.find(params[:id])
		render json: trip.to_json(
				except: [:traveller_id, :updated_at, :created_at],
				include: [
					organizer: { only: :name} ,
					# travellers: {except: [:created_at, :updated_at]},
					attendees: {except: [:created_at, :updated_at, :id]},
					event_timeline: {
						include: [traveller_name: { only: :name}],
						except: [:created_at, :updated_at, :traveller_id, :trip_id, :id]
					}
				]
			)
	end

	def create

		start_date = Trip.parseDateString(params[:start_date])
		end_date = Trip.parseDateString(params[:end_date])

		Trip.create(
			nickname: params[:nickname], 
			destination: params[:destination], 
			start_date: Time.new(start_date[0], start_date[1], start_date[2]), 
			end_date: Time.new(end_date[0], end_date[1], end_date[2]), 
			traveller_id: params[:traveller_id], 
			image: params[:image])
	end

	def destroy
		tripID = params[:id]
		Trip.destroy(tripID)
	end


end