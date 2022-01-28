class CreateCommunities < ActiveRecord::Migration[6.1]
  def change
    create_table :communities do |t|
      t.references :user, null: false, foreign_key: true
      t.string :content
      t.string :image

      t.timestamps
    end
  end
end
