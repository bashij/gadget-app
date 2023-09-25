require 'rails_helper'

RSpec.describe 'TweetBookmarks', type: :request do
  let(:user) { create(:user) }
  let(:tweet) { create(:tweet, user_id: user.id) }
  let(:other_user) { create(:user) }
  let(:other_tweet) { create(:tweet, user_id: other_user.id) }

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        post "/api/v1/tweets/#{tweet.id}/tweet_bookmarks", params: { tweet_id: tweet.id }
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
        specify 'ツイートへのブックマーク数が１件増える' do
          expect do
            post "/api/v1/tweets/#{tweet.id}/tweet_bookmarks", params: { tweet_id: tweet.id }
          end.to change(TweetBookmark.all, :count).by(1)
        end
      end

      # context '失敗の場合' do
      # end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へ遷移するための情報を返す' do
        delete "/api/v1/tweets/#{tweet.id}/tweet_bookmarks", params: { tweet_id: tweet.id }
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
        post "/api/v1/tweets/#{tweet.id}/tweet_bookmarks", params: { tweet_id: tweet.id }
      end

      context '成功の場合' do
        specify 'ツイートへのブックマーク数が１件減る' do
          expect do
            delete "/api/v1/tweets/#{tweet.id}/tweet_bookmarks", params: { tweet_id: tweet.id }
          end.to change(TweetBookmark.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のツイートへのブックマークを削除しようとすると操作失敗の情報を返す' do
          delete "/api/v1/tweets/#{other_tweet.id}/tweet_bookmarks", params: { tweet_id: other_tweet.id }
          json = JSON.parse(response.body)

          expect(response).to have_http_status :ok
          expect(json['status']).to eq('failure')
          expect(json['message']).to eq(['この操作は実行できません'])
        end
      end
    end
  end
end
