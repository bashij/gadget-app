class AddReviewToGadgets < ActiveRecord::Migration[6.1]
  def change
    add_column :gadgets, :review, :text
  end
end
