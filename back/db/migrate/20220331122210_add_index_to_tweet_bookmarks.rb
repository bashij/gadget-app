class AddIndexToTweetBookmarks < ActiveRecord::Migration[6.1]
  def change
    add_index :tweet_bookmarks, [:user_id, :tweet_id], unique: true
  end
end
