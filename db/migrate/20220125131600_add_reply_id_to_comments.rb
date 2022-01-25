class AddReplyIdToComments < ActiveRecord::Migration[6.1]
  def change
    add_column :comments, :reply_id, :integer
  end
end
