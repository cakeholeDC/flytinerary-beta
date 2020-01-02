class TravellersController < ApplicationController

	def index 
		travellers = Traveller.all
		render json: travellers.to_json(
			except: [:updated_at, :created_at]
			)
	end

	def show 
		traveller = Traveller.find(params[:id])
		render json: traveller.to_json(
			except: [:updated_at, :created_at]
			)
	end
end
