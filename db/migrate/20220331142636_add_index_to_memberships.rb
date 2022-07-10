class AddIndexToMemberships < ActiveRecord::Migration[6.1]
  def change
    add_index :memberships, [:user_id, :community_id], unique: true
  end
end
