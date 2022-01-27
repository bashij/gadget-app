class ReviewRequest < ApplicationRecord
  belongs_to :user
  belongs_to :gadget
end
