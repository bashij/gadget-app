class Gadget < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :gadget_likes, dependent: :destroy
  has_many :gadget_bookmarks, dependent: :destroy
  has_many :review_requests, dependent: :destroy
  has_many :requesting_users, through: :review_requests, source: :user
  validates :user_id, presence: true
  validates :name, presence: true, length: { maximum: 50 }
  validates :category, presence: true, length: { maximum: 50 },
                       inclusion: { in: %w[PC本体 モニター キーボード マウス オーディオ デスク チェア その他] }
  validates :model_number, length: { maximum: 100 }
  validates :manufacturer, length: { maximum: 50 }
  validates :price, numericality: { allow_nil: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 9_999_999 }
  validates :other_info, length: { maximum: 100 }
  validates :review, length: { maximum: 5000 }
  mount_uploader :image, GadgetImageUploader
  has_rich_text :review

  # ユーザーが既にいいねしているか？
  def liked_by?(user)
    return false if user.nil?

    gadget_likes.pluck(:user_id).include?(user.id)
  end

  # ユーザーが既にブックマークしているか？
  def bookmarked_by?(user)
    return false if user.nil?

    gadget_bookmarks.pluck(:user_id).include?(user.id)
  end

  # ユーザーが既にレビューリクエストしているか？
  def requested_by?(user)
    return false if user.nil?

    review_requests.pluck(:user_id).include?(user.id)
  end

  # ガジェットに紐づく親コメントを返す
  def parent_comments
    comments.where(parent_id: nil).includes(:user)
  end
end
