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
  scope :name_like, ->(name) { like_scope('name', name) }
  scope :category_like, ->(category) { like_scope('category', category) }
  scope :model_number_like, ->(model_number) { like_scope('model_number', model_number) }
  scope :manufacturer_like, ->(manufacturer) { like_scope('manufacturer', manufacturer) }
  scope :other_info_like, ->(other_info) { like_scope('other_info', other_info) }
  scope :price_more_than, ->(price) { where('price >= ?', price.to_f) if price.present? }
  scope :price_less_than, ->(price) { where('price <= ?', price.to_f) if price.present? }

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

  # 特定ユーザーのガジェットを整形して返す
  def self.own_gadget(user, paginate)
    Gadget.includes(:user, :gadget_likes, :gadget_bookmarks, :review_requests)
          .where(user_id: user)
          .page(paginate)
  end

  # 指定の値を部分一致で検索
  def self.like_scope(attribute, value)
    if value.present?
      where("#{attribute} LIKE ?", "%#{value}%")
    else
      all
    end
  end

  # 検索条件に一致する全てのガジェット情報を返す
  def self.filter_by(params)
    # 指定の並び順で全件取得
    column, direction = extract_sort_conditions(params[:sort_condition])
    gadgets = all.order("#{column} #{direction}")

    # 検索条件がある場合は絞り込み
    gadgets = gadgets.name_like(params[:name])
    gadgets = gadgets.category_like(params[:category])
    gadgets = gadgets.model_number_like(params[:model_number])
    gadgets = gadgets.manufacturer_like(params[:manufacturer])
    gadgets = gadgets.price_more_than(params[:price_minimum])
    gadgets = gadgets.price_less_than(params[:price_maximum])
    gadgets = gadgets.other_info_like(params[:other_info])

    gadgets
  end

  def self.extract_sort_conditions(sort_condition)
    case sort_condition
    when '', '更新が新しい順'
      %w[updated_at desc]
    when '更新が古い順'
      %w[updated_at asc]
    when '価格が安い順'
      %w[price asc]
    when '価格が高い順'
      %w[price desc]
    else
      [nil, nil]
    end
  end
end
