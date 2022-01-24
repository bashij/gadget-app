class CreateGadgets < ActiveRecord::Migration[6.1]
  def change
    create_table :gadgets do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.string :category
      t.string :model_number
      t.string :manufacturer
      t.decimal :price, precision: 8, scale: 2
      t.string :other_info
      t.string :image

      t.timestamps
    end
  end
end
