FactoryBot.define do
  factory :user do
    name                  { Faker::Name.name }
    email                 { Faker::Internet.free_email }
    job                   { %w[IT系 非IT系 学生 YouTuber/ブロガー その他].sample }
    introduction          { Faker::Lorem.paragraph_by_chars(number: 100) }
    image                 { Rack::Test::UploadedFile.new(Rails.root.join('app/assets/images/default.jpeg')) }
    password              { 'password' }
    password_confirmation { 'password' }
  end
end
