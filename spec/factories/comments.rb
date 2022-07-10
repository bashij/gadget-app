FactoryBot.define do
  factory :comment do
    user
    gadget
    content { 'テストコメント' }
  end
end
