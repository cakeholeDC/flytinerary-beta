class TripsController < ApplicationController

	def index
		trips = Trip.all
		render json: trips.to_json(
				except: [:traveller_id, :updated_at],
				include: [
					organizer: { only: :name} ,
					# travellers: {except: [:created_at, :updated_at]},
					attendees: {except: [:created_at, :updated_at]},
					events: {
						include: :traveller_name,
						except: [:created_at, :updated_at]
					}
				]
			)
	end
	
	def show
		trip = Trip.find(params[:id])
		render json: trip.to_json(
				except: [:traveller_id, :updated_at],
				include: [
					organizer: { only: :name} ,
					# travellers: {except: [:created_at, :updated_at]},
					attendees: {except: [:created_at, :updated_at]},
					event_timeline: {except: [:created_at, :updated_at]}
				]
			)
	end

	def create

		start_date = Trip.parseDateString(params[:start_date])
		end_date = Trip.parseDateString(params[:start_date])

		Trip.create(
			nickname: params[:nickname], 
			destination: params[:destination], 
			start_date: Time.new(start_date[0], start_date[1], start_date[2]), 
			end_date: Time.new(end_date[0], end_date[1], end_date[2]), 
			traveller_id: params[:traveller_id], 
			image: params[:image])
	end


end