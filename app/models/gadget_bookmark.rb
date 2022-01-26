class GadgetBookmark < ApplicationRecord
  belongs_to :user
  belongs_to :gadget
end
