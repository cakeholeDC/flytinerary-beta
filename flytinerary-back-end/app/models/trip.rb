class Trip < ApplicationRecord
	has_many :events
	has_many :travellers, through: :events
	# validates_uniqueness_of :travellers, through: :events
	belongs_to :organizer, class_name: "Traveller", foreign_key: "traveller_id"
end
