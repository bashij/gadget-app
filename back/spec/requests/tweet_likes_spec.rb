require 'rails_helper'

RSpec.describe 'TweetLikes', type: :request do
  let(:user) { create(:user) }
  let(:tweet) { create(:tweet, user_id: user.id) }
  let(:other_user) { create(:user) }
  let(:other_tweet) { create(:tweet, user_id: other_user.id) }

  describe 'POST #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        post tweet_tweet_likes_path(tweet)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      context '成功の場合' do
        specify 'ツイートへのいいね数が１件増える' do
          expect do
            post tweet_tweet_likes_path(tweet), xhr: true
          end.to change(TweetLike.all, :count).by(1)
        end
      end

      # context '失敗の場合' do
      # end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        delete tweet_tweet_likes_path(tweet)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
        post tweet_tweet_likes_path(tweet)
      end

      context '成功の場合' do
        specify 'ツイートへのいいね数が１件減る' do
          expect do
            delete tweet_tweet_likes_path(tweet), xhr: true
          end.to change(TweetLike.all, :count).by(-1)
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のツイートへのいいねを削除しようとするとホーム画面へリダイレクトされる' do
          delete tweet_tweet_likes_path(other_tweet), xhr: true
          expect(response).to redirect_to root_url
        end
      end
    end
  end
end
