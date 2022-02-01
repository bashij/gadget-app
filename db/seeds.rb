# メインのサンプルユーザーを作成
User.create!(name: 'bashi',
             email: 'bashi@gmail.com',
             job: 'IT系',
             password: 'foobar',
             password_confirmation: 'foobar')

# その他のサンプルユーザーを作成
99.times do |n|
  name  = Faker::Name.name
  email = "example-#{n + 1}@gmail.com"
  password = 'password'
  jobs = ['IT系', '非IT系', 'YouTuber/ブロガー', '学生', 'その他']
  User.create!(name: name,
               email: email,
               job: jobs.sample,
               password: password,
               password_confirmation: password)
end

# ユーザーの一部を対象に、サンプルツイート/ガジェット/リプライ/いいね/ブックマーク/コミュニティを作成
users = User.order(:created_at).take(6)
# User.first.tweets.order(created_at: :desc).limit(1).ids[0]では取得できないため、一時的に最新ツイートのidを直接指定
cnt = 301

# ツイート 新規作成
50.times do
  content = Faker::Lorem.paragraph_by_chars(number: 100)
  users.each do |user|
    # ツイート
    user.tweets.create!(content: content)
  end
end

# ガジェット・コミュニティ 新規作成
5.times do
  users.each do |user|
    # ガジェット
    name = "MacBook Pro #{user.id}"
    category = "PC本体 #{user.id}"
    model_number = "modelNo #{user.id}"
    manufacturer = "Apple #{user.id}"
    price = 200_000
    other_info = "メモリ:16GB #{user.id}"
    review = "#{user.name} #{Faker::Lorem.paragraph_by_chars(number: 2000)}"
    user.gadgets.create!(name: name,
                         category: category,
                         model_number: model_number,
                         manufacturer: manufacturer,
                         price: price,
                         other_info: other_info,
                         review: review)
    # コミュニティ
    name = "#{user.name} コミュニティ"
    user.communities.create!(name: name)
  end
end

# ツイート：リプライ/いいね/ブックマーク
20.times do
  tweet_content = "リプライ: #{Faker::Lorem.paragraph_by_chars(number: 100)}"
  users.each do |user|
    # ツイート
    user.tweets.create!(content: tweet_content, reply_id: cnt)
    user.tweet_likes.create!(tweet_id: cnt)
    user.tweet_bookmarks.create!(tweet_id: cnt)
  end
  cnt -= 1
end

# ガジェット：コメント/リプライ/いいね/ブックマーク/リクエスト コミュニティ：新規加入
5.times do
  community_sample = Community.all.ids
  gadget_sample = Gadget.all.ids
  comment_content = "コメント: #{Faker::Lorem.paragraph_by_chars(number: 100)}"
  users.each do |user|
    # ガジェット
    user.comments.create!(gadget_id: gadget_sample.sample, content: comment_content)
    user.gadget_likes.create!(gadget_id: gadget_sample.sample)
    user.gadget_bookmarks.create!(gadget_id: gadget_sample.sample)
    user.review_requests.create!(gadget_id: gadget_sample.sample)
    # コミュニティ
    user.memberships.create!(community_id: community_sample.sample)
  end
end

# 以下のリレーションシップを作成する
users = User.all
user  = users.first
following = users[2..50]
followers = users[3..40]
following.each { |followed| user.follow(followed) }
followers.each { |follower| follower.follow(user) }
