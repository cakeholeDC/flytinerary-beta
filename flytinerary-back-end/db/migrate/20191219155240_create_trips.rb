class CreateTrips < ActiveRecord::Migration[6.0]
  def change
    create_table :trips do |t|
      t.string :nickname
      t.string :destination
      t.datetime :start_date
      t.datetime :end_date
      t.references :traveller, null: false, foreign_key: true
      t.string :image

      t.timestamps
    end
  end
end
