class AddLimitsToTweets < ActiveRecord::Migration[6.1]
  def change
    change_column :tweets, :content, :string, limit: 140
  end
end