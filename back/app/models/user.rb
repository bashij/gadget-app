class User < ApplicationRecord
  has_many :tweets, dependent: :destroy
  has_many :gadgets, dependent: :destroy
  has_many :active_relationships,  class_name: 'Relationship',
                                   foreign_key: 'follower_id',
                                   inverse_of: 'follower',
                                   dependent: :destroy
  has_many :passive_relationships, class_name: 'Relationship',
                                   foreign_key: 'followed_id',
                                   inverse_of: 'followed',
                                   dependent: :destroy
  has_many :following, through: :active_relationships,  source: :followed
  has_many :followers, through: :passive_relationships, source: :follower
  has_many :tweet_likes, dependent: :destroy
  has_many :liked_tweets, through: :tweet_likes, source: :tweet
  has_many :tweet_bookmarks, dependent: :destroy
  has_many :bookmarked_tweets, through: :tweet_bookmarks, source: :tweet
  has_many :comments, dependent: :destroy
  has_many :gadget_likes, dependent: :destroy
  has_many :liked_gadgets, through: :gadget_likes, source: :gadget
  has_many :gadget_bookmarks, dependent: :destroy
  has_many :bookmarked_gadgets, through: :gadget_bookmarks, source: :gadget
  has_many :review_requests, dependent: :destroy
  has_many :requested_reviews, through: :review_requests, source: :gadget
  has_many :communities, dependent: :destroy
  has_many :memberships, dependent: :destroy
  has_many :joining_communities, through: :memberships, source: :community
  attr_accessor :remember_token

  before_save { self.email = email.downcase }
  validates :name,  presence: true, length: { maximum: 50 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
  validates :email, presence: true, length: { maximum: 255 },
                    format: { with: VALID_EMAIL_REGEX },
                    uniqueness: { case_sensitive: false }
  validates :job, presence: true, length: { maximum: 50 },
                  inclusion: { in: %w[IT系 非IT系 学生 YouTuber/ブロガー その他] }
  mount_uploader :image, UserImageUploader
  has_secure_password
  validates :password, presence: true, length: { minimum: 6 }, allow_nil: true
  scope :name_like, ->(name) { like_scope('name', name) }
  scope :job_like, ->(job) { like_scope('job', job) }

  # 渡された文字列のハッシュ値を返す
  def self.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                  BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  # ランダムなトークンを返す
  def self.new_token
    SecureRandom.urlsafe_base64
  end

  # 永続セッションのためにユーザーをデータベースに記憶する
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  # 渡されたトークンがダイジェストと一致したらtrueを返す
  def authenticated?(remember_token)
    return false if remember_digest.nil?

    BCrypt::Password.new(remember_digest).is_password?(remember_token)
  end

  # ユーザーのログイン情報を破棄する
  def forget
    update_attribute(:remember_digest, nil)
  end

  # フォローしているユーザーのツイートフィード
  def following_users_tweets
    following_ids = 'SELECT followed_id FROM relationships
                     WHERE follower_id = :user_id'
    Tweet.where("parent_id IS NULL AND (tweets.user_id IN (#{following_ids})
                     OR tweets.user_id = :user_id)", user_id: id)
         .includes(:user, :tweet_likes, :tweet_bookmarks)
  end

  # フォローしているユーザーのガジェットフィード
  def following_users_gadgets(params)
    following_ids = 'SELECT followed_id FROM relationships
                     WHERE follower_id = :user_id'
    Gadget.where("gadgets.user_id IN (#{following_ids})
                     OR gadgets.user_id = :user_id", user_id: id)
          .filter_by(params)
          .includes(:user, :gadget_likes, :gadget_bookmarks, :review_requests)
  end

  # ユーザーをフォローする
  def follow(other_user)
    following << other_user
  end

  # ユーザーをフォロー解除する
  def unfollow(other_user)
    active_relationships.find_by(followed_id: other_user.id).destroy
  end

  # 現在のユーザーがフォローしてたらtrueを返す
  def following?(other_user)
    following.include?(other_user)
  end

  # ユーザーがブックマークしているツイートを、ブックマークした日時順に返す
  def bookmarked_tweets_reordered
    bookmarked_tweets.includes(:tweet_likes, :tweet_bookmarks)
                     .reorder('tweet_bookmarks.created_at DESC')
  end

  # ユーザーがブックマークしているガジェットを、ブックマークした日時順に返す
  def bookmarked_gadgets_reordered
    bookmarked_gadgets.includes(:user, :gadget_likes, :gadget_bookmarks, :review_requests)
                      .reorder('gadget_bookmarks.created_at DESC')
  end

  # ユーザーが参加しているコミュニティを、参加した日時順に返す
  def joining_communities_reordered
    joining_communities.includes(:user, :memberships)
                       .reorder('memberships.created_at DESC')
  end

  # 指定の値を部分一致で検索
  def self.like_scope(attribute, value)
    if value.present?
      where("#{attribute} LIKE ?", "%#{value}%")
    else
      all
    end
  end

  # 検索条件に一致する全てのユーザー情報を返す
  def self.filter_by(params)
    # 指定の並び順で全件取得
    column, direction = extract_sort_conditions(params[:sort_condition])
    users = all.order("#{column} #{direction}")

    # 検索条件がある場合は絞り込み
    users = users.name_like(params[:name])
    users = users.job_like(params[:job])

    users
  end

  def self.extract_sort_conditions(sort_condition)
    case sort_condition
    when '', '更新が新しい順'
      %w[updated_at desc]
    when '更新が古い順'
      %w[updated_at asc]
    else
      [nil, nil]
    end
  end
end
