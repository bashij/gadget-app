class TweetBookmark < ApplicationRecord
  belongs_to :user
  belongs_to :tweet
  validates :user_id, uniqueness: { scope: :tweet_id }
  validates :user_id, presence: true
  validates :tweet_id, presence: true
end
