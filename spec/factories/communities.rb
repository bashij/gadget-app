FactoryBot.define do
  factory :community do
    user
    name  { 'Appleファン' }
    image { Rack::Test::UploadedFile.new(Rails.root.join('app/assets/images/default.jpeg')) }
  end
end
