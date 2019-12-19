class Trip < ApplicationRecord
	has_many :events
	has_many :travellers, through: :events
	belongs_to :organizer, class_name: "Traveller", foreign_key: "traveller_id"
end
