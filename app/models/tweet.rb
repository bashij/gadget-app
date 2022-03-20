class Tweet < ApplicationRecord
  belongs_to :user
  has_many :tweet_likes, dependent: :destroy
  has_many :tweet_bookmarks, dependent: :destroy
  default_scope -> { order(created_at: :desc) }
  validates :user_id, presence: true
  validates :content, presence: true, length: { maximum: 140 }

  # ユーザーが既にいいねしているか？
  def liked_by?(user)
    return false if user.nil?

    tweet_likes.pluck(:user_id).include?(user.id)
  end

  # ユーザーが既にブックマークしているか？
  def bookmarked_by?(user)
    return false if user.nil?

    tweet_bookmarks.pluck(:user_id).include?(user.id)
  end
end
