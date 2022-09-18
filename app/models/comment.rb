class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :gadget
  default_scope -> { order(created_at: :desc) }
  validates :user_id, presence: true
  validates :gadget_id, presence: true
  validates :content, presence: true, length: { maximum: 140 }

  # 親コメントがあれば返す/無ければ空の配列を返す
  def self.find_parent(id)
    return [] if id.nil?

    Comment.find(id)
  end

  # 親コメントへのリプライコメントがあれば返す/無ければ空の配列を返す
  def self.find_all_replies(id)
    return [] if id.nil?

    Comment.where(id)
  end

  # 親コメント毎のリプライコメント数
  def self.reply_count
    Comment.group(:parent_id).reorder(nil).count
  end
end
