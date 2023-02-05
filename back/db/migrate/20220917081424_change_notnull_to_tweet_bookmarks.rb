class ChangeNotnullToTweetBookmarks < ActiveRecord::Migration[6.1]
  def change
    change_column_null :tweet_bookmarks, :user_id, false
    change_column_null :tweet_bookmarks, :tweet_id, false
  end
end
