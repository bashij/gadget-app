class AddIntroductionToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :introduction, :string, limit: 140
  end
end
