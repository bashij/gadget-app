FactoryBot.define do
  factory :community do
    user
    name  { Faker::Lorem.paragraph_by_chars(number: 10) }
    image { Rack::Test::UploadedFile.new(Rails.root.join('app/assets/images/default.jpeg')) }
  end
end
