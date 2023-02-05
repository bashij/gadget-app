class AddIndexToTweetLikes < ActiveRecord::Migration[6.1]
  def change
    add_index :tweet_likes, [:user_id, :tweet_id], unique: true
  end
end
