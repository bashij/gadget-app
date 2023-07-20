class AddIndexToGadgetLikes < ActiveRecord::Migration[6.1]
  def change
    add_index :gadget_likes, [:user_id, :gadget_id], unique: true
  end
end
