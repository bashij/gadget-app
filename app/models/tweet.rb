class Tweet < ApplicationRecord
  belongs_to :user
  has_many :tweet_likes, dependent: :destroy
  default_scope -> { order(created_at: :desc) }
  validates :user_id, presence: true
  validates :content, presence: true, length: { maximum: 140 }

  def liked_by?(user)
    tweet_likes.exists?(user_id: user.id)
  end
end
