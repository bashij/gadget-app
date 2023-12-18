class AddLimitsToGadgets < ActiveRecord::Migration[6.1]
  def change
    change_column :gadgets, :name, :string, limit: 20
    change_column :gadgets, :category, :string, limit: 20
    change_column :gadgets, :model_number, :string, limit: 20
    change_column :gadgets, :manufacturer, :string, limit: 20
    change_column :gadgets, :price, :integer, limit: 8, unsigned: true
    change_column :gadgets, :other_info, :string, limit: 20
    change_column :gadgets, :review, :text, limit: 5000
  end
end
