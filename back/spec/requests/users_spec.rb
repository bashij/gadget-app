require 'rails_helper'

RSpec.describe 'Users', type: :request do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  describe 'GET #index' do
    specify '一覧画面の表示が成功する' do
      get users_path
      expect(response).to have_http_status :ok
    end

    specify 'コンテンツのヘッダが存在する' do
      get users_path
      expect(response.body).to include 'ユーザー一覧'
    end
  end

  describe 'GET #show' do
    specify '詳細画面の表示が成功する' do
      get user_path(user)
      expect(response).to have_http_status :ok
    end

    describe '各コンテンツのヘッダが存在する' do
      specify '登録ガジェット一覧' do
        get user_path(user)
        expect(response.body).to include '登録ガジェット一覧'
      end

      specify 'コミュニティ' do
        get user_path(user)
        expect(response.body).to include 'コミュニティ'
      end

      specify 'ツイート' do
        get user_path(user)
        expect(response.body).to include 'ツイート'
      end

      specify 'ブックマークツイート' do
        get user_path(user)
        expect(response.body).to include 'ブックマークツイート'
      end

      specify 'ブックマークガジェット' do
        get user_path(user)
        expect(response.body).to include 'ブックマークガジェット'
      end
    end
  end

  describe 'GET #new' do
    specify '新規作成画面の表示が成功する' do
      get new_user_path
      expect(response).to have_http_status :ok
    end

    specify 'コンテンツのヘッダが存在する' do
      get new_user_path
      expect(response.body).to include 'ユーザー登録'
    end
  end

  describe 'GET #following' do
    specify 'フォロー一覧画面の表示が成功する' do
      get following_user_path(user)
      expect(response).to have_http_status :ok
    end

    specify 'コンテンツのヘッダが存在する' do
      get following_user_path(user)
      expect(response.body).to include 'フォロー'
    end
  end

  describe 'GET #followers' do
    specify '新規作成画面の表示が成功する' do
      get followers_user_path(user)
      expect(response).to have_http_status :ok
    end

    specify 'コンテンツのヘッダが存在する' do
      get followers_user_path(user)
      expect(response.body).to include 'フォロワー'
    end
  end

  describe 'POST #create' do
    context '新規作成成功の場合' do
      specify 'ユーザー数が１件増える' do
        expect do
          post users_path, params: { user:
                                   { name: 'テストユーザー',
                                     email: 'example@gmail.com',
                                     job: 'IT系',
                                     password: 'password' } }
        end.to change(User.all, :count).by(1)
      end

      specify 'ホーム画面へリダイレクトされる' do
        post users_path, params: { user:
                                 { name: 'テストユーザー',
                                   email: 'example@gmail.com',
                                   job: 'IT系',
                                   password: 'password' } }
        expect(response).to redirect_to root_url
      end
    end

    context '新規作成失敗の場合' do
      specify 'ユーザー登録画面が再表示される' do
        post users_path, params: { user:
                                 { name: '',
                                   email: 'example@gmail.com',
                                   job: 'IT系',
                                   password: 'password' } }
        expect(response.body).to include 'ユーザー登録'
      end
    end
  end

  describe 'GET #edit' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        get edit_user_path(user)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      specify '編集画面の表示が成功する' do
        get edit_user_path(user)
        expect(response).to have_http_status :ok
      end

      specify 'コンテンツのヘッダが存在する' do
        get edit_user_path(user)
        expect(response.body).to include 'ユーザー情報編集'
      end

      specify 'ログインユーザー以外の編集画面を表示しようとするとホーム画面へリダイレクトされる' do
        user
        get edit_user_path(other_user)
        expect(response).to redirect_to root_url
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        delete user_path(user)
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      context '削除成功の場合' do
        specify 'ユーザー数が１件減る' do
          expect { delete user_path(user) }.to change(User.all, :count).by(-1)
        end

        specify 'ホーム画面へリダイレクトされる' do
          delete user_path(user)
          expect(response).to redirect_to root_url
        end
      end

      context '削除失敗の場合' do
        specify 'ログインユーザー以外を削除しようとするとホーム画面へリダイレクトされる' do
          user
          delete user_path(other_user)
          expect(response).to redirect_to root_url
        end
      end
    end
  end

  describe 'PATCH #update' do
    context 'ログインしていない状態' do
      specify 'ログイン画面へリダイレクトされる' do
        patch user_path(user), params: { user: { name: "#{user.name} updateテスト" } }
        expect(response).to redirect_to login_path
      end
    end

    context 'ログインしている状態' do
      before do
        post login_path, params: { session: { email: user.email, password: user.password, remember_me: 0 } }
      end

      context '更新成功の場合' do
        specify 'nameが更新される' do
          user_name = user.name
          patch user_path(user), params: { user: { name: "#{user_name} updateテスト" } }
          expect(user.reload.name).not_to eq user_name
        end

        specify 'ユーザー詳細画面へリダイレクトされる' do
          user_name = user.name
          patch user_path(user), params: { user: { name: "#{user_name} updateテスト" } }
          expect(response).to redirect_to user_path(user)
        end
      end

      context '更新失敗の場合' do
        specify 'ユーザー編集画面が再表示される' do
          user_name = ''
          patch user_path(user), params: { user: { name: user_name } }
          expect(response.body).to include 'ユーザー情報編集'
        end

        specify 'ログインユーザー以外を更新しようとするとホーム画面へリダイレクトされる' do
          user
          patch user_path(other_user), params: { user: { name: 'updateテスト' } }
          expect(response).to redirect_to root_url
        end
      end
    end
  end
end
