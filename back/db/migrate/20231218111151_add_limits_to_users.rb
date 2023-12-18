class AddLimitsToUsers < ActiveRecord::Migration[6.1]
  def change
    change_column :users, :name, :string, limit: 20
    change_column :users, :email, :string, limit: 255
    change_column :users, :job, :string, limit: 20
  end
end
