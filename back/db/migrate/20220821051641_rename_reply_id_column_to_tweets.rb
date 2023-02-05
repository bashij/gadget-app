class RenameReplyIdColumnToTweets < ActiveRecord::Migration[6.1]
  def change
    rename_column :tweets, :reply_id, :parent_id
  end
end
