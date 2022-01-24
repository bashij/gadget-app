class Gadget < ApplicationRecord
  belongs_to :user
  validates :user_id, presence: true
  validates :name, presence: true, length: { maximum: 50 }
  validates :category, presence: true, length: { maximum: 50 }
  validates :model_number, length: { maximum: 100 }
  validates :manufacturer, length: { maximum: 50 }
  validates :price, numericality: { allow_nil: true }
  validates :other_info, length: { maximum: 100 }
  validates :review, length: { maximum: 5000 }
  mount_uploader :image, GadgetImageUploader
end
