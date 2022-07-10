class AddIndexToReviewRequests < ActiveRecord::Migration[6.1]
  def change
    add_index :review_requests, [:user_id, :gadget_id], unique: true
  end
end
