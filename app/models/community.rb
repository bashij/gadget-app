class Community < ApplicationRecord
  belongs_to :user
  has_many :memberships, dependent: :destroy
  has_many :joined_members, through: :memberships, source: :user
  validates :user_id, presence: true
  validates :name, presence: true, length: { maximum: 50 }
  mount_uploader :image, CommunityImageUploader

  # ユーザーが既に参加しているか？
  def joined_by?(user)
    memberships.pluck(:user_id).include?(user.id)
  end
end
