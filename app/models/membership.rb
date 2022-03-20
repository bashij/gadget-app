class Membership < ApplicationRecord
  belongs_to :user
  belongs_to :community
  default_scope -> { order(created_at: :desc) }
end
