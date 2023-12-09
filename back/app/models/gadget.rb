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
  scope :review_like, ->(review) { like_scope('review', review) }
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
    gadgets = gadgets.review_like(params[:review])

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

  # おすすめガジェット情報を返す
  def self.recommend_gadgets(user)
    # ユーザーがアクションを取ったガジェットIDの取得
    interested_gadget_ids = fetch_interested_gadget_ids(user)

    # ユーザーが最も関心のあるガジェットを特定
    most_interested_gadget_id = determine_most_interested_gadget(user)

    # 対象ガジェットが存在しない場合は空データを返して処理を終了する
    return Gadget.where(id: most_interested_gadget_id) if most_interested_gadget_id.nil?

    # 関連ガジェットのスコアを計算
    relation_scores = calculate_related_gadgets_scores(most_interested_gadget_id, user)

    # スコア順にガジェットIDをソート
    sorted_gadget_ids = sort_gadget_ids_by_scores(relation_scores, interested_gadget_ids)

    Gadget.where(id: sorted_gadget_ids).order(Arel.sql("FIELD(id, #{sorted_gadget_ids.join(',')})"))
  end

  # ユーザーがアクションを取ったガジェットIDの取得
  def self.fetch_interested_gadget_ids(user)
    actions_arrays = fetch_actions_arrays(user)
    actions_arrays.flatten(1).map { |item| item[0] }.uniq
  end

  # ユーザーがアクションを取ったガジェットIDと日時を取得
  def self.fetch_actions_arrays(user)
    actions_arrays = [
      GadgetLike.where(user_id: user),
      GadgetBookmark.where(user_id: user),
      ReviewRequest.where(user_id: user),
      Comment.where(user_id: user)
    ].map { |action| action.pluck(:gadget_id, :created_at) }

    actions_arrays
  end

  # ユーザーが最も関心のあるガジェットを特定
  def self.determine_most_interested_gadget(user)
    actions_arrays = fetch_actions_arrays(user)

    # ガジェットID毎に最新のアクション日時を取得
    id_info_map = {}
    actions_arrays.each do |array|
      array.each do |id, time|
        id_info = id_info_map[id] ||= { interaction_level: 0, latest_time: nil }

        id_info[:interaction_level] += 1
        id_info[:latest_time] = time if id_info[:latest_time].nil? || time > id_info[:latest_time]
      end
    end

    # 同一ガジェットへ行なったアクションの最大数を取得（例：あるガジェットにいいねとブックマークをした→interaction_levelは2）
    max_interaction_level_info = id_info_map.max_by { |_id, info| info[:interaction_level] }
    max_interaction_level = max_interaction_level_info&.last&.fetch(:interaction_level, 0)

    # 基本的にはinteraction_levelが2以上のガジェットを関心ありとみなす
    # ※2以上であれば、levelより日時が新しいことを優先する
    # ※level1のガジェットしかない場合は、level1のみ対象とする
    base_level = max_interaction_level == 1 ? 1 : 2

    # 基準の中で、アクションを起こしたのが最も新しいガジェットを、最も関心があるガジェットとみなす
    most_interested_gadget_id = id_info_map.select { |_id, info| info[:interaction_level] >= base_level }
                                           .max_by { |_id, info| info[:latest_time] }
                                           &.first
    most_interested_gadget_id
  end

  # 関連ガジェットのスコアを計算
  def self.calculate_related_gadgets_scores(most_interested_gadget_id, user)
    # アクション・ガジェット毎のスコアを計算
    related_gadgets_count_like = calculate_related_gadget_count(GadgetLike, most_interested_gadget_id, user, 1)
    related_gadgets_count_bookmark = calculate_related_gadget_count(GadgetBookmark, most_interested_gadget_id, user, 2)
    related_gadgets_count_request = calculate_related_gadget_count(ReviewRequest, most_interested_gadget_id, user, 2)
    related_gadgets_count_comment = calculate_related_gadget_count(Comment, most_interested_gadget_id, user, 2)

    related_gadgets_actions_count = [
      related_gadgets_count_like,
      related_gadgets_count_bookmark,
      related_gadgets_count_request,
      related_gadgets_count_comment
    ]

    # ガジェット毎の総アクション数を計算
    related_gadgets_count_sum = related_gadgets_actions_count.each_with_object({}) do |hash, result|
      hash.each do |key, value|
        result[key] ||= 0
        result[key] += value
      end
    end

    # 全アクション数の合計値
    total_count = related_gadgets_count_sum.values.sum
    # 各ガジェットへのアクション数が、全体のアクション数に占める割合を、おすすめガジェットの関連度スコアとする
    relation_scores = related_gadgets_count_sum.transform_values { |count| (count.to_f / total_count * 100).round(2) }
    relation_scores
  end

  # 対象ガジェットに関連するユーザーが別のガジェットに行ったアクション数を計算する
  def self.calculate_related_gadget_count(model, most_interested_gadget_id, user, weight)
    # 対象ガジェットにアクションしたユーザーIDを配列で取得
    users_ids = model.where(gadget_id: most_interested_gadget_id)
                     .where.not(user_id: user)
                     .pluck(:user_id)

    # 対象ガジェットにアクションしたユーザーが、他にアクションしている全てのガジェットをIDごとに集計
    related_gadgets_count = model.where(user_id: users_ids)
                                 .reorder(nil) # デフォルトのソートを解除
                                 .group(:gadget_id)
                                 .count
    # 対象ガジェットは集計から除外
    related_gadgets_count.delete(most_interested_gadget_id)

    # 各アクション毎に設定した重みを加算する（例：いいねよりもブックマークの方が、関連度により影響を与えるものとする）
    related_gadgets_count.transform_values { |value| value * weight }
  end

  # スコア順にガジェットIDをソート
  def self.sort_gadget_ids_by_scores(relation_scores, interested_gadget_ids)
    sorted_gadget_ids = relation_scores.keys.sort_by { |id| -relation_scores[id] }
    sorted_gadget_ids - interested_gadget_ids # 既に関心のあるガジェットはおすすめ対象から除外
  end
end
