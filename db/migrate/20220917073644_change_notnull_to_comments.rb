class ChangeNotnullToComments < ActiveRecord::Migration[6.1]
  def change
    change_column_null :comments, :content, false
  end
end
