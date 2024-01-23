class ChangeLimitsForGadgets < ActiveRecord::Migration[6.1]
  def change
    change_column :gadgets, :name, :string, limit: 40
    change_column :gadgets, :model_number, :string, limit: 40
    change_column :gadgets, :manufacturer, :string, limit: 40
    change_column :gadgets, :other_info, :string, limit: 40
  end
end
