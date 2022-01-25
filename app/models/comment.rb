class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :gadget
  validates :user_id, presence: true
  validates :gadget_id, presence: true
  validates :content, presence: true, length: { maximum: 140 }
end
