class AddReplyIdToTweet < ActiveRecord::Migration[6.1]
  def change
    add_column :tweets, :reply_id, :integer
  end
end
