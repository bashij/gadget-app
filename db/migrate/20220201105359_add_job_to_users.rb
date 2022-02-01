class AddJobToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :job, :string, after: :email
  end
end
