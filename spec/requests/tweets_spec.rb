require 'rails_helper'

RSpec.describe 'Tweets', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:other_tweet) { create(:tweet) }

  describe 'GET #create' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        post tweets_path, params: { tweet: { user_id: user.id, content: 'テストツイート' } }
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      context '新規作成成功の場合' do
        specify 'ツイート数が１件増える' do
          expect do
            post tweets_path, params: { tweet: { user_id: user.id, content: 'テストツイート1' } }, xhr: true
          end.to change(Tweet.all, :count).by(1)
        end

        specify '新規作成したツイートが画面に表示される' do
          post tweets_path, params: { tweet: { user_id: user.id, content: 'テストツイート2' } }, xhr: true
          expect(response.body).to include 'テストツイート2'
        end

        specify '投稿完了メッセージが画面に表示される' do
          post tweets_path, params: { tweet: { user_id: user.id, content: 'テストツイート3' } }, xhr: true
          expect(response.body).to include '投稿が完了しました。'
        end
      end

      context '新規作成失敗の場合' do
        specify 'ツイート数が増減しない' do
          expect do
            post tweets_path, params: { tweet: { user_id: user.id, content: '' } }, xhr: true
          end.to change(Tweet.all, :count).by(0)
        end

        specify 'バリデーションメッセージが画面に表示される' do
          post tweets_path, params: { tweet: { user_id: user.id, content: '' } }, xhr: true
          expect(response.body).to include 'ツイート内容を入力してください'
        end
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        delete tweet_path(user)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      context '成功の場合' do
        specify 'ツイート数が１件減る' do
          post tweets_path, params: { tweet: { user_id: user.id, content: 'テストツイート' } }, xhr: true
          tweet = Tweet.last
          expect do
            delete tweet_path(tweet), params: { tweet: { user_id: tweet.user_id } }, xhr: true
          end.to change(Tweet.all, :count).by(-1)
        end

        specify '削除完了メッセージが画面に表示される' do
          post tweets_path, params: { tweet: { user_id: user.id, content: 'テストツイート' } }, xhr: true
          tweet = Tweet.last
          delete tweet_path(tweet), params: { tweet: { user_id: tweet.user_id } }, xhr: true
          expect(response.body).to include '削除されました。'
        end
      end

      context '失敗の場合' do
        specify 'ログインユーザー以外のツイートを削除しようとするとホーム画面へリダイレクトされる' do
          delete tweet_path(other_tweet), params: { tweet: { user_id: user.id } }, xhr: true
          expect(response).to redirect_to root_url
        end
      end
    end
  end
end
