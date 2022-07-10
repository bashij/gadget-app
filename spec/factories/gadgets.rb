FactoryBot.define do
  factory :gadget do
    user
    name         { 'MacBook Pro' }
    category     { %w[PC本体 モニター キーボード マウス オーディオ デスク チェア その他].sample }
    model_number { 'MYDA2J/A' }
    manufacturer { 'Apple' }
    price        { 148_280 }
    other_info   { '13インチ,8GB' }
    review       { Faker::Lorem.paragraph_by_chars(number: 2000) }
  end
end
