# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_12_19_155457) do

  create_table "events", force: :cascade do |t|
    t.string "event_type"
    t.datetime "start"
    t.datetime "end"
    t.text "description"
    t.integer "trip_id", null: false
    t.integer "traveller_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["traveller_id"], name: "index_events_on_traveller_id"
    t.index ["trip_id"], name: "index_events_on_trip_id"
  end

  create_table "travellers", force: :cascade do |t|
    t.string "name"
    t.integer "age"
    t.string "gender"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "trips", force: :cascade do |t|
    t.string "nickname"
    t.string "destination"
    t.datetime "start_date"
    t.datetime "end_date"
    t.integer "traveller_id", null: false
    t.string "image"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["traveller_id"], name: "index_trips_on_traveller_id"
  end

  add_foreign_key "events", "travellers"
  add_foreign_key "events", "trips"
  add_foreign_key "trips", "travellers"
end
