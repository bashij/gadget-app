class ChangeNotnullToCommunities < ActiveRecord::Migration[6.1]
  def change
    change_column_null :communities, :name, false
  end
end
