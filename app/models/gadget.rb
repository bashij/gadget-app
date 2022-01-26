class Gadget < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :gadget_likes, dependent: :destroy
  has_many :gadget_bookmarks, dependent: :destroy
  validates :user_id, presence: true
  validates :name, presence: true, length: { maximum: 50 }
  validates :category, presence: true, length: { maximum: 50 }
  validates :model_number, length: { maximum: 100 }
  validates :manufacturer, length: { maximum: 50 }
  validates :price, numericality: { allow_nil: true }
  validates :other_info, length: { maximum: 100 }
  validates :review, length: { maximum: 5000 }
  mount_uploader :image, GadgetImageUploader

  # ユーザーが既にいいねしているか？
  def liked_by?(user)
    gadget_likes.pluck(:user_id).include?(user.id)
  end

  # ユーザーが既にブックマークしているか？
  def bookmarked_by?(user)
    gadget_bookmarks.pluck(:user_id).include?(user.id)
  end
end
