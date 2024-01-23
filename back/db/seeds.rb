require "csv"

# メインユーザーを作成
CSV.foreach('db/seeds/csv/users.csv', headers: true) do |row|
  User.create!(
    name: row['name'],
    email: row['email'],
    job: row['job'],
    introduction: row['introduction'] || "",
    password: row['password'],
    password_confirmation: row['password_confirmation']
  )
end

# メインユーザーを取得
users = User.where("email LIKE ?", "%example%").order(:created_at).take(8)

# フォロー関係を作成
users.each do |user|
  CSV.foreach("db/seeds/csv/relationships.csv", headers: true) do |row|
    if row['user_email'] == user.email
      id = User.find_by(email: row['followed_user_email'])
      user.follow(id)
    end
  end
end

# ガジェットを作成
users.each do |user|
  CSV.foreach("db/seeds/csv/gadgets.csv", headers: true) do |row|
    if row['user_email'] == user.email
      user.gadgets.create!(
        name: row['name'],
        category: row['category'],
        model_number: row['model_number'] || "",
        manufacturer: row['manufacturer'] || "",
        price: row['price'] || 0,
        other_info: row['other_info'] || "",
        review: row['review'] || ""
      )
    end
  end
end

# ランダムに更新（タイムラインでユーザーごとに固まってしまうため）
50.times do
  target_gadget = Gadget.all
  target_gadget.sample.touch
end

# コミュニティを作成
users.each do |user|
  CSV.foreach("db/seeds/csv/communities.csv", headers: true) do |row|
    if row['user_email'] == user.email
      user.communities.create!(
        name: row['name'],
      )
    end
  end
end

# ランダムに更新（タイムラインでユーザーごとに固まってしまうため）
20.times do
  target_gadget = Community.all
  target_gadget.sample.touch
end

# コミュニティへ参加
users.each do |user|
  CSV.foreach("db/seeds/csv/memberships.csv", headers: true) do |row|
    if row['user_email'] == user.email
      community_id = Community.find_by(name: row['name']).id
      user.memberships.create!(community_id: community_id)
    end
  end
end

# ツイートとリプライを作成
# CSVデータ読み込み
csv_data_hashes = CSV.read("db/seeds/csv/tweets.csv", headers: true).map(&:to_h)

# 親ツイートの処理
csv_data_hashes.each do |row|
  next if row['parent_id']

  user = User.find_by(email: row['user_email'])
  tweet = user.tweets.create!(content: row['content'])

  # リプライツイート用の対照表作成
  real_parent_id = tweet.id
  csv_data_hashes.each { |r| r["real_parent_id"] = real_parent_id if r["parent_id"] == row['id'] }
end

# リプライツイートの処理
result_hash = csv_data_hashes.each_with_object({}) do |hash, new_hash|
  id = hash["id"].to_i
  new_hash[id] = hash["real_parent_id"] if hash['parent_id']
end

csv_data_hashes.each do |row|
  next unless row['parent_id']

  user = User.find_by(email: row['user_email'])
  parent_id = result_hash[row['id'].to_i]

  # 子ツイート作成
  user.tweets.create!(content: row['content'], parent_id: parent_id)
end

# コメントとリプライを作成
# CSVデータ読み込み
csv_data_hashes = CSV.read("db/seeds/csv/comments.csv", headers: true).map(&:to_h)

# 親コメントの処理
csv_data_hashes.each do |row|
  next if row['parent_id']
  next unless row['user_email']
  
  user = User.find_by(email: row['user_email'])
  gadget = Gadget.joins(:user).find_by(name: row['gadget_name'], user: { email: row['gadget_user_email'] })
  comment = user.comments.create!(gadget_id: gadget.id, content: row['content'])

  # リプライコメント用の対照表作成
  real_parent_id = comment.id
  csv_data_hashes.each { |r| r["real_parent_id"] = real_parent_id if r["parent_id"] == row['id'] }
end

# リプライコメントの処理
result_hash = csv_data_hashes.each_with_object({}) do |hash, new_hash|
  id = hash["id"].to_i
  new_hash[id] = hash["real_parent_id"] if hash['parent_id']
end

csv_data_hashes.each do |row|
  next unless row['parent_id']
  next unless row['user_email']

  user = User.find_by(email: row['user_email'])
  parent_id = result_hash[row['id'].to_i]
  gadget_id = Comment.find(parent_id).gadget_id

  # 子コメント作成
  user.comments.create!(gadget_id: gadget_id, content: row['content'], parent_id: parent_id)
end

# ツイートへのアクションを追加
users.each do |user|
  CSV.foreach("db/seeds/csv/tweets_actions.csv", headers: true) do |row|
    if row['user_email'] == user.email
      tweet = Tweet.find_by(content: row['content'])
      user.tweet_likes.create!(tweet_id: tweet.id) if row['like']
      user.tweet_bookmarks.create!(tweet_id: tweet.id) if row['bookmark']
    end
  end
end

# ガジェットへのアクションを追加
users.each do |user|
  CSV.foreach("db/seeds/csv/gadgets_actions.csv", headers: true) do |row|
    if row['user_email'] == user.email
      gadget = Gadget.joins(:user).find_by(name: row['gadget_name'], user: { email: row['gadget_user_email'] })
      user.gadget_likes.create!(gadget_id: gadget.id) if row['like']
      user.gadget_bookmarks.create!(gadget_id: gadget.id) if row['bookmark']
      user.review_requests.create!(gadget_id: gadget.id) if row['request']
    end
  end
end