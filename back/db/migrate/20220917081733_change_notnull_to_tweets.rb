class ChangeNotnullToTweets < ActiveRecord::Migration[6.1]
  def change
    change_column_null :tweets, :content, false
  end
end
