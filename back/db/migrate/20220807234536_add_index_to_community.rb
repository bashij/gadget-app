class AddIndexToCommunity < ActiveRecord::Migration[6.1]
  def change
    add_index :communities, :name, unique: true
  end
end
