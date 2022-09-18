class ChangeNotnullToGadgets < ActiveRecord::Migration[6.1]
  def change
    change_column_null :gadgets, :name, false
    change_column_null :gadgets, :category, false
  end
end
