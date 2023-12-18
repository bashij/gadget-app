class AddLimitsToCommunities < ActiveRecord::Migration[6.1]
  def change
    change_column :communities, :name, :string, limit: 20
  end
end
