class GadgetBookmark < ApplicationRecord
  belongs_to :user
  belongs_to :gadget
  validates :user_id, uniqueness: { scope: :gadget_id }
  validates :user_id, presence: true
  validates :gadget_id, presence: true
end
