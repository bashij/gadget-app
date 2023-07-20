class ChangeDataPriceToGadget < ActiveRecord::Migration[6.1]
  def change
    change_column :gadgets, :price, :integer
  end
end
