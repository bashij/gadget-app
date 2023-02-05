class RenameReplyIdColumnToComments < ActiveRecord::Migration[6.1]
  def change
    rename_column :comments, :reply_id, :parent_id
  end
end
