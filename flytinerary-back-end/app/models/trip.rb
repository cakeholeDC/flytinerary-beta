class Trip < ApplicationRecord
	has_many :events, dependent: :destroy
	has_many :travellers, through: :events
	# validates_uniqueness_of :travellers, through: :events
	belongs_to :organizer, class_name: "Traveller", foreign_key: "traveller_id"

	def self.parseDateString(string)
		#input format is yyyy-mm-dd
		arr = string.split('-')

		arr.map do |index|
			index.to_i
		end
	end

	def attendees
		self.travellers.uniq
	end

	def event_timeline
		self.events.sort_by do |event|
			event.start
		end
	end
end
