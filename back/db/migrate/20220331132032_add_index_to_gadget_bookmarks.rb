class AddIndexToGadgetBookmarks < ActiveRecord::Migration[6.1]
  def change
    add_index :gadget_bookmarks, [:user_id, :gadget_id], unique: true
  end
end
