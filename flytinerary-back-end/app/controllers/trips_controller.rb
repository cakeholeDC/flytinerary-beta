class TripsController < ApplicationController

	def index
		trips = Trip.all.sort_by { |trip| trip.start_date }
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

		newTrip = Trip.create(
			nickname: params[:nickname], 
			destination: params[:destination], 
			start_date: Time.new(start_date[0], start_date[1], start_date[2]), 
			end_date: Time.new(end_date[0], end_date[1], end_date[2]), 
			traveller_id: params[:traveller_id], 
			image: params[:image])

		render json: newTrip.to_json(
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

	def update
		trip = Trip.find(params[:id])

		start_date = Trip.parseDateString(params[:start_date])
		end_date = Trip.parseDateString(params[:end_date])

		trip.nickname = params[:nickname]
		trip.destination = params[:destination]
		trip.start_date = Time.new(start_date[0], start_date[1], start_date[2]) 
		trip.end_date = Time.new(end_date[0], end_date[1], end_date[2])
		trip.traveller_id = params[:traveller_id]
		trip.image = params[:image]

		trip.save

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

	def destroy
		tripID = params[:id]
		Trip.destroy(tripID)
	end


end