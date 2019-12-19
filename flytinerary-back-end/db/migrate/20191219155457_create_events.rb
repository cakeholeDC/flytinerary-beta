class CreateEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :events do |t|
      t.string :event_type
      t.datetime :start
      t.datetime :end
      t.text :description
      t.references :trip, null: false, foreign_key: true
      t.references :traveller, null: false, foreign_key: true

      t.timestamps
    end
  end
end
