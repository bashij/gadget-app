class Community < ApplicationRecord
  belongs_to :user
  has_many :memberships, dependent: :destroy
  has_many :joined_members, through: :memberships, source: :user
  default_scope -> { order(created_at: :desc) }
  validates :user_id, presence: true
  validates :name, presence: true, length: { maximum: 20 }, uniqueness: true
  mount_uploader :image, CommunityImageUploader

  # ユーザーが既に参加しているか？
  def joined_by?(user)
    return false if user.nil?

    memberships.pluck(:user_id).include?(user.id)
  end
end
