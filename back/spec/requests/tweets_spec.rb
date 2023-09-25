require 'rails_helper'

RSpec.describe 'Tweets', type: :request do
  let(:user) { create(:user) }
  let(:tweet) { create(:tweet, user_id: user.id) }
  let(:other_user) { create(:user) }
  let(:other_tweet) { create(:tweet) }

  describe 'GET #index' do
    before do
      # 2件のtweetを新規作成
      @tweet1 = create(:tweet)
      @tweet2 = create(:tweet)
    end

    specify 'リクエストが成功する' do
      get '/api/v1/tweets/'
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get '/api/v1/tweets/'
      json = JSON.parse(response.body)

      expect(json['tweets'].length).to eq(2)
    end
  end

  describe 'GET #user_tweets' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # ログインユーザーで3件のtweetを新規作成
      @tweet1 = create(:tweet, user: user)
      @tweet2 = create(:tweet, user: user)
      @tweet3 = create(:tweet, user: user)
    end

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/user_tweets/"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/user_tweets/"
      json = JSON.parse(response.body)

      expect(json['tweets'].length).to eq(3)
    end
  end

  describe 'GET #user_bookmark_tweets' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # 2件のtweetを新規作成
      @tweet1 = create(:tweet)
      @tweet2 = create(:tweet)
      # 上記のtweetをブックマーク
      post "/api/v1/tweets/#{@tweet1.id}/tweet_bookmarks", params: { tweet_id: @tweet1.id }
      post "/api/v1/tweets/#{@tweet2.id}/tweet_bookmarks", params: { tweet_id: @tweet2.id }
    end

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/user_bookmark_tweets/"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/user_bookmark_tweets/"
      json = JSON.parse(response.body)

      expect(json['tweets'].length).to eq(2)
    end
  end

  describe 'GET #following_users_tweets' do
    before do
      # ログイン
      session_params = { email: user.email, password: user.password, remember_me: 0 }
      post '/api/v1/login', params: { session: session_params }
      # 別のユーザーで合計3件のtweetを新規作成
      @other_user1 = create(:user)
      @other_user2 = create(:user)
      @tweet1 = create(:tweet, user: @other_user1)
      @tweet2 = create(:tweet, user: @other_user1)
      @tweet3 = create(:tweet, user: @other_user2)
      # ログインユーザーで別のユーザーをフォロー
      post '/api/v1/relationships', params: { followed_id: @other_user1.id }
      post '/api/v1/relationships', params: { followed_id: @other_user2.id }
    end

    specify 'リクエストが成功する' do
      get "/api/v1/users/#{user.id}/following_users_tweets/"
      expect(response).to have_http_status :ok
    end

    specify '要求通りの情報を返す' do
      get "/api/v1/users/#{user.id}/following_users_tweets/"
      json = JSON.parse(response.body)

      expect(json['tweets'].length).to eq(3)
    end
  end

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        valid_params = { user_id: user.id, content: 'テストツイート' }
        post '/api/v1/tweets', params: { tweet: valid_params }
        json = JSON.parse(response.body)

        expect(response).to have_http_status :ok
        expect(json['status']).to eq('notLoggedIn')
        expect(json['message']).to eq(['ログインしてください'])
      end
    end

    context 'ログインしている状態' do
      before do
        session_params = { email: user.email, password: user.password, remember_me: 0 }
        post '/api/v1/login', params: { session: session_params }
      end

      context '成功の場合' do
        specify 'ツイート数が１件増える' do
          expect do
            valid_params = { user_id: user.id, content: 'テストツイート' }
            post '/api/v1/tweets', params: { tweet: valid_params }
          end.to change(Tweet.all, :count).by(1)
        end

        specify '成功した情報を返す' do
          valid_params = { user_id: user.id, content: 'テストツイート' }
          post '/api/v1/tweets', params: { tweet: valid_params }
          json = JSON.parse(response.body)

          expect(json['status']).to eq('success')
          expect(json['message']).to eq(['投稿が完了しました'])
        end
      end

      context '失敗の場合' do
        specify 'ツイート数が増減しない' do
          expect do
            valid_params = { user_id: user.id, content: '' }
            post '/api/v1/tweets', params: { tweet: valid_params }
          end.not_to change(Tweet.all, :count)
        end

        specify '処理失敗の情報を返す' do
          valid_params = { user_id: user.id, content: '' }
          post '/api/v1/tweets', params: { tweet: valid_params }
          json = JSON.parse(response.body)

          expect(json['status']).to eq('failure')
        end
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        delete "/api/v1/tweets/#{tweet.id}"
        json = JSON.parse(response.body)

        expect(response).to have_http_status :ok
        expect(json['status']).to eq('notLoggedIn')
        expect(json['message']).to eq(['ログインしてください'])
      end
    end

    context 'ログインしている状態' do
      before do
        # ログイン
        session_params = { email: user.email, password: user.password, remember_me: 0 }
        post '/api/v1/login', params: { session: session_params }
        # 新規ツイート作成
        valid_params = { user_id: user.id, content: 'テストツイート' }
        post '/api/v1/tweets', params: { tweet: valid_params }
        @new_tweet = user.tweets.last
        @user_id = @new_tweet.user_id
      end

      context '成功の場合' do
        specify 'ツイート数が１件減る' do
          expect do
            delete "/api/v1/tweets/#{@new_tweet.id}"
          end.to change(Tweet.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のツイートを削除しようとすると操作失敗の情報を返す' do
          delete "/api/v1/tweets/#{other_tweet.id}"
          json = JSON.parse(response.body)

          expect(response).to have_http_status :ok
          expect(json['status']).to eq('failure')
          expect(json['message']).to eq(['この操作は実行できません'])
        end
      end
    end
  end
end
