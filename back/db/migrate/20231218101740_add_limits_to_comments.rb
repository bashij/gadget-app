class AddLimitsToComments < ActiveRecord::Migration[6.1]
  def change
    change_column :comments, :content, :string, limit: 140
  end
end
