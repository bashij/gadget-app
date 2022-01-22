# メインのサンプルユーザーを作成
User.create!(name: 'bashi',
             email: 'bashi@gmail.com',
             password: 'foobar',
             password_confirmation: 'foobar')

# その他のサンプルユーザーを作成
99.times do |n|
  name  = Faker::Name.name
  email = "example-#{n + 1}@gmail.com"
  password = 'password'
  User.create!(name: name,
               email: email,
               password: password,
               password_confirmation: password)
end

# ユーザーの一部を対象に、サンプルツイート/リプライ/いいね/ブックマークを作成
users = User.order(:created_at).take(6)
# User.first.tweets.order(created_at: :desc).limit(1).ids[0]では取得できないため、一時的に最新ツイートのidを直接指定
cnt = 301

# ツイート
50.times do
  content = Faker::Lorem.paragraph_by_chars(number: 100)
  users.each { |user| user.tweets.create!(content: content) }
end

# リプライ/いいね/ブックマーク
20.times do
  content = "リプライ: #{Faker::Lorem.paragraph_by_chars(number: 100)}"
  users.each do |user|
    user.tweets.create!(content: content, reply_id: cnt)
    user.tweet_likes.create!(tweet_id: cnt)
    user.tweet_bookmarks.create!(tweet_id: cnt)
  end
  cnt -= 1
end

# 以下のリレーションシップを作成する
users = User.all
user  = users.first
following = users[2..50]
followers = users[3..40]
following.each { |followed| user.follow(followed) }
followers.each { |follower| follower.follow(user) }
