class Membership < ApplicationRecord
  belongs_to :user
  belongs_to :community
  default_scope -> { order(created_at: :desc) }
  validates :user_id, uniqueness: { scope: :community_id }
  validates :user_id, presence: true
  validates :community_id, presence: true
end
