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

  # 親ツイートがあれば返す/無ければ空の配列を返す
  def self.find_parent(id)
    return [] if id.nil?

    Tweet.find(id)
  end

  # 親ツイートへのリプライツイートがあれば返す/無ければ空の配列を返す
  def self.find_all_replies(id)
    return [] if id.nil?

    Tweet.where(id)
  end

  # 親ツイート毎のリプライツイート数
  def self.reply_count
    Tweet.group(:parent_id).reorder(nil).count
  end
end
