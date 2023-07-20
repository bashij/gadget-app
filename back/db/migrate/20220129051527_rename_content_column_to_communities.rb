class RenameContentColumnToCommunities < ActiveRecord::Migration[6.1]
  def change
    rename_column :communities, :content, :name
  end
end
