class TravellersController < ApplicationController

	def show 
		traveller = Traveller.find(params[:id])
		render json: traveller.to_json(
			except: [:updated_at, :created_at]
			)
	end
end
