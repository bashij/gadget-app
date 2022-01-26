class CreateGadgetLikes < ActiveRecord::Migration[6.1]
  def change
    create_table :gadget_likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :gadget, null: false, foreign_key: true

      t.timestamps
    end
  end
end
