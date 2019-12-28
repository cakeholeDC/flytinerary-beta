class Event < ApplicationRecord
  belongs_to :trip
  belongs_to :traveller
  belongs_to :traveller_name, class_name: 'Traveller', foreign_key: "traveller_id"

  	def self.parseDateTimeString(string)
		#input format is yyyy-mm-ddTHH:MM
		string.gsub!('T','-')
		string.gsub!(':','-')
		arr = string.split('-')

		arr.map do |index|
			index.to_i
		end
	end

end
