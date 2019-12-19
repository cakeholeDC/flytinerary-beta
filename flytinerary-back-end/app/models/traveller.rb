class Traveller < ApplicationRecord
	has_many :events
	has_many :trips, through: :events
	has_many :organized, class_name: "Trip", foreign_key: "traveller_id"
end
