class Community < ApplicationRecord
  belongs_to :user
  validates :user_id, presence: true
  validates :name, presence: true, length: { maximum: 50 }
  mount_uploader :image, CommunityImageUploader
end
