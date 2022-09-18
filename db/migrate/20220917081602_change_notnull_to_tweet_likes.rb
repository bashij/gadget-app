class ChangeNotnullToTweetLikes < ActiveRecord::Migration[6.1]
  def change
    change_column_null :tweet_likes, :user_id, false
    change_column_null :tweet_likes, :tweet_id, false
  end
end
