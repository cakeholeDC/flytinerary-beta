class Event < ApplicationRecord
  belongs_to :trip
  belongs_to :traveller
  belongs_to :traveller_name, class_name: 'Traveller', foreign_key: "traveller_id"
end
